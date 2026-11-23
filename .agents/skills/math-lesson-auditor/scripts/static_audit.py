#!/usr/bin/env python3
"""Heuristic offline checks for a static HTML math site (stdlib only).

This is NOT a browser test, mathematical validator, or proof of accessibility.
"""
from __future__ import annotations

import argparse
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.links: list[tuple[str, str, str]] = []
        self.missing_alt: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if attributes.get("id"):
            self.ids.append(attributes["id"] or "")
        if tag == "a" and attributes.get("href"):
            self.links.append(("a", "href", attributes["href"] or ""))
        if tag == "script" and attributes.get("src"):
            self.links.append(("script", "src", attributes["src"] or ""))
        if tag == "img":
            if "alt" not in attributes:
                self.missing_alt.append(attributes.get("src") or "<inline>")
            if attributes.get("src"):
                self.links.append(("img", "src", attributes["src"] or ""))
        if tag == "link" and attributes.get("href"):
            self.links.append(("link", "href", attributes["href"] or ""))
        if tag in ("audio", "video", "source", "iframe") and attributes.get("src"):
            self.links.append((tag, "src", attributes["src"] or ""))


def page_for(path: Path, cache: dict[Path, PageParser]) -> PageParser:
    if path not in cache:
        parser = PageParser()
        parser.feed(path.read_text(encoding="utf-8", errors="replace"))
        parser.close()
        cache[path] = parser
    return cache[path]


def check_file(path: Path, root: Path, cache: dict[Path, PageParser]) -> list[tuple[str, str]]:
    warnings: list[tuple[str, str]] = []
    page = page_for(path, cache)
    duplicated = sorted(value for value, count in Counter(page.ids).items() if count > 1)
    for item in duplicated:
        warnings.append(("ERROR", f"дублирующийся id=\"{item}\""))
    for image_source in page.missing_alt:
        warnings.append(("WARN", f"нет атрибута alt у img: {image_source}"))

    for tag, prop, value in page.links:
        if value.startswith(("//", "data:", "javascript:", "mailto:", "tel:")):
            continue
        # URLs assembled by JS cannot be resolved by a static checker.
        if any(marker in value for marker in ("${", "{{", "}")):
            continue
        parts = urlsplit(value)
        if parts.scheme or parts.netloc:
            continue
        local_path = unquote(parts.path)
        target = (root / local_path.lstrip("/")) if local_path.startswith("/") else (path.parent / local_path)
        if not local_path:
            target = path
        target = target.resolve()
        if not target.is_relative_to(root):
            warnings.append(("WARN", f"путь выходит за пределы проекта: {value}"))
            continue
        if target.is_dir():
            target = target / "index.html"
        if not target.is_file():
            warnings.append(("ERROR", f"нет локального ресурса {tag}[{prop}]={value}"))
            continue
        if tag == "a" and parts.fragment and target.suffix.lower() in (".html", ".htm"):
            # Sites can create anchors dynamically. Treat the result as a warning, not a hard failure.
            try:
                target_ids = set(page_for(target, cache).ids)
            except OSError:
                continue
            anchor = unquote(parts.fragment)
            if anchor not in target_ids and anchor != "top":
                warnings.append(("WARN", f"якорь #{anchor} не найден в статическом HTML ({value}); мог создаваться JS"))
    return warnings


def main() -> int:
    argp = argparse.ArgumentParser(description=__doc__)
    argp.add_argument("--root", type=Path, default=Path("."), help="корень сайта")
    argp.add_argument("--path", action="append", default=[], help="HTML файл или директория относительно корня; можно повторять")
    args = argp.parse_args()
    root = args.root.resolve()
    if not root.is_dir():
        argp.error(f"нет директории: {root}")
    paths: list[Path] = []
    if args.path:
        for item in args.path:
            path = (root / item).resolve()
            if not path.is_relative_to(root):
                argp.error(f"путь выходит за пределы корня: {item}")
            if path.is_dir():
                paths.extend(sorted(path.rglob("*.html")))
            elif path.is_file() and path.suffix.lower() in (".html", ".htm"):
                paths.append(path)
            else:
                argp.error(f"HTML файл или директория не найдены: {item}")
    else:
        paths = sorted(root.rglob("*.html"))
    paths = sorted(set(paths))
    cache: dict[Path, PageParser] = {}
    counts = Counter()
    for path in paths:
        for level, detail in check_file(path, root, cache):
            counts[level] += 1
            print(f"{level}: {path.relative_to(root)}: {detail}")
    print(f"Проверено HTML файлов: {len(paths)}; ошибок: {counts['ERROR']}; предупреждений: {counts['WARN']}")
    print("Важно: динамические ссылки/якоря и визуальные/математические ошибки этот скрипт не проверяет.")
    return 1 if counts["ERROR"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
