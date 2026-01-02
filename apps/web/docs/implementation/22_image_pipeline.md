# 22 画像パイプライン

1. **現像/書き出し**：sRGB、長辺 1600–2560px、品質 85–90
2. **フォーマット**：AVIF 優先 → WebP → JPEG フォールバック
3. **メタデータ**：IPTC（Creator/Caption/Location/Rights）・ライセンス情報を付与
4. **保護**：必要に応じて C2PA Content Credentials
5. **配信**：`next/image` + `sizes/srcset`、LCP は `preload`
6. **静的アセット管理**：`content/series-assets/series_manifest.json` を編集し、`scripts/series-assets/prepare_series_assets.py` を実行して長辺 2560px・WebP 化したファイルを `public/series-gallery/<slug>/<slug>-NN.webp` に書き出す（ImageMagick と Python の Pillow ライブラリを利用）。出力寸法は `content/series-assets/series_metadata.json` と `content/series-assets/series_gallery_report.json` で記録。
