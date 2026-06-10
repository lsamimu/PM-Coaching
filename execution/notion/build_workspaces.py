#!/usr/bin/env python3
"""
Scaffold PM Launch Lab Notion workspaces from execution/notion/manifest.json.

Requires NOTION_TOKEN and NOTION_PARENT_PAGE_ID in repo-root .env.

Usage:
  python execution/notion/build_workspaces.py --dry-run
  python execution/notion/build_workspaces.py
  python execution/notion/build_workspaces.py --product pm-networking-os
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = Path(__file__).resolve().parent / "manifest.json"


def _load_manifest() -> list[dict]:
    if not MANIFEST.exists():
        print(f"Missing {MANIFEST}. Run: cd website && npx tsx scripts/export-notion-manifest.ts")
        sys.exit(1)
    return json.loads(MANIFEST.read_text())


def _infer_property(name: str, is_first: bool) -> dict:
    lower = name.lower()

    if is_first or lower in {"company", "name", "role", "question", "skill area", "weak area", "contact"}:
        return {"title": {}}

    if "?" in name or lower.startswith(("completed", "practiced", "replied", "follow-up sent", "meeting booked", "can refer")):
        return {"checkbox": {}}

    if any(k in lower for k in ("date", "week of", "applied date", "last contact", "next touch", "target date")):
        return {"date": {}}

    if any(k in lower for k in ("score", "level", "confidence", "gap size", "learning hours", "duration", "compensation")):
        return {"number": {"format": "number"}}

    if "url" in lower or "link" in lower and "job" in lower:
        return {"url": {}}

    if lower in {"status", "priority", "category", "difficulty", "format", "type", "relationship type", "message type", "interviewer type", "outcome", "referral outcome"}:
        return {"select": {"options": []}}

    if lower in {"notes", "tasks", "deliverable", "reflection", "key takeaway", "prep notes", "key takeaways", "feedback notes", "action items", "evidence", "practice plan", "key learnings", "next focus", "questions covered"}:
        return {"rich_text": {}}

    return {"rich_text": {}}


def _slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


class NotionBuilder:
    def __init__(self, token: str, parent_id: str, dry_run: bool = False):
        self.dry_run = dry_run
        self.parent_id = parent_id.replace("-", "")
        if not dry_run:
            from notion_client import Client

            self.client = Client(auth=token)
        else:
            self.client = None

    def _call(self, label: str, action):
        if self.dry_run:
            print(f"  [dry-run] {label}")
            return {"id": f"dry-{_slugify(label)[:20]}"}
        result = action()
        time.sleep(0.35)  # gentle rate limit
        return result

    def create_page(self, parent_id: str, title: str, icon: str | None = None) -> dict:
        props = {"title": [{"type": "text", "text": {"content": title}}]}
        body: dict = {
            "parent": {"type": "page_id", "page_id": parent_id.replace("-", "")},
            "properties": {"title": props},
        }
        if icon:
            body["icon"] = {"type": "emoji", "emoji": icon}
        return self._call(f"page: {title}", lambda: self.client.pages.create(**body))

    def create_database(self, parent_id: str, name: str, fields: list[str]) -> dict:
        properties = {}
        for i, field in enumerate(fields):
            properties[field] = _infer_property(field, i == 0)

        body = {
            "parent": {"type": "page_id", "page_id": parent_id.replace("-", "")},
            "title": [{"type": "text", "text": {"content": name}}],
            "properties": properties,
        }
        return self._call(f"database: {name}", lambda: self.client.databases.create(**body))

    def append_blocks(self, page_id: str, blocks: list[dict]) -> None:
        if self.dry_run:
            print(f"  [dry-run] append {len(blocks)} blocks")
            return
        # Notion allows max 100 blocks per request
        for i in range(0, len(blocks), 100):
            chunk = blocks[i : i + 100]
            self.client.blocks.children.append(block_id=page_id.replace("-", ""), children=chunk)
            time.sleep(0.35)

    def add_content_page(self, parent_id: str, title: str, paragraphs: list[str]) -> dict:
        page = self.create_page(parent_id, title)
        blocks = [
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {"rich_text": [{"type": "text", "text": {"content": p}}]},
            }
            for p in paragraphs
        ]
        self.append_blocks(page["id"], blocks)
        return page

    def build_product(self, product: dict) -> None:
        emoji = product.get("emoji", "📦")
        title = f"{emoji} {product['title']}"
        print(f"\n=== {title} ===")

        root = self.create_page(self.parent_id, title, icon=emoji)
        root_id = root["id"]

        # Home blurb
        home_blocks = [
            {
                "object": "block",
                "type": "callout",
                "callout": {
                    "icon": {"type": "emoji", "emoji": emoji},
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {"content": product.get("tagline", "")},
                            "annotations": {"bold": True},
                        }
                    ],
                },
            },
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{"type": "text", "text": {"content": product.get("problem", "")}}]
                },
            },
            {
                "object": "block",
                "type": "heading_2",
                "heading_2": {"rich_text": [{"type": "text", "text": {"content": "Outcome"}}]},
            },
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{"type": "text", "text": {"content": product.get("outcome", "")}}]
                },
            },
            {
                "object": "block",
                "type": "heading_2",
                "heading_2": {"rich_text": [{"type": "text", "text": {"content": "What this product owns"}}]},
            },
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{"type": "text", "text": {"content": product.get("owns", "")}}]
                },
            },
        ]
        self.append_blocks(root_id, home_blocks)

        # Section pages
        section_ids: dict[str, str] = {}
        for section in product.get("notionStructure", []):
            section_title = section["section"]
            section_page = self.create_page(root_id, section_title)
            section_ids[section_title] = section_page["id"]

            for page_name in section.get("pages", []):
                placeholder = [
                    f"Content for **{page_name}** — replace with final copy.",
                    f"Part of: {product['title']}",
                ]
                if page_name in {"Sammy's Journey (Non-Technical → Microsoft PM)", "Sammy's Journey"}:
                    placeholder = [
                        "TODO: Add Sammy's real journey story here.",
                        "Non-technical background → Microsoft PM. Include: starting point, key pivots, what worked, timeline.",
                    ]
                self.add_content_page(section_page["id"], page_name, placeholder)

        # Databases — attach under first section or root
        db_parent = section_ids.get(next(iter(section_ids), ""), root_id) if section_ids else root_id
        for db in product.get("databases", []):
            db_page = self.create_database(db_parent, db["name"], db["fields"])
            print(f"  ✓ database: {db['name']} → {db_page['id']}")

        # Template index page
        if product.get("templates"):
            templates_page = self.create_page(root_id, "📋 Templates Index")
            tpl_blocks = []
            for tpl in product["templates"]:
                tpl_blocks.append(
                    {
                        "object": "block",
                        "type": "bulleted_list_item",
                        "bulleted_list_item": {
                            "rich_text": [{"type": "text", "text": {"content": tpl}}]
                        },
                    }
                )
            self.append_blocks(templates_page["id"], tpl_blocks)

        # Workflow
        workflow_page = self.create_page(root_id, "🔄 User Workflow")
        wf_blocks = []
        for step in product.get("userWorkflow", []):
            wf_blocks.append(
                {
                    "object": "block",
                    "type": "numbered_list_item",
                    "numbered_list_item": {
                        "rich_text": [
                            {
                                "type": "text",
                                "text": {"content": f"Step {step['step']}: {step['action']}"},
                            }
                        ]
                    },
                }
            )
        self.append_blocks(workflow_page["id"], wf_blocks)

        print(f"  ✓ root: {root_id}")
        print("  → After content pass: enable 'Allow duplicate as template' on this page")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build PM Launch Lab Notion workspaces")
    parser.add_argument("--dry-run", action="store_true", help="Print plan without API calls")
    parser.add_argument("--product", help="Build only this slug (e.g. pm-networking-os)")
    args = parser.parse_args()

    load_dotenv(ROOT / ".env")
    import os

    token = os.getenv("NOTION_TOKEN", "").strip()
    parent_id = os.getenv("NOTION_PARENT_PAGE_ID", "").strip()

    if not args.dry_run and (not token or not parent_id):
        print("Set NOTION_TOKEN and NOTION_PARENT_PAGE_ID in repo-root .env")
        print("See directives/notion_resources.md")
        sys.exit(1)

    products = _load_manifest()
    if args.product:
        products = [p for p in products if p["slug"] == args.product]
        if not products:
            print(f"No product with slug: {args.product}")
            sys.exit(1)

    builder = NotionBuilder(token, parent_id, dry_run=args.dry_run)
    for product in products:
        builder.build_product(product)

    print("\nDone.")


if __name__ == "__main__":
    main()
