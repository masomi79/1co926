Roadmap

1co926 プロジェクト - アプリ完成までのロードマップ

前提（このロードマップの想定）
- 入力: KMZ（KML を zip 圧縮したもの）を GeoJSON に変換 → Firestore に格納
- フロントエンド: React Native（iOS/Android）で地図表示＋地点詳細閲覧（MVP）
- バックエンド: Firebase Firestore（インポートは管理用サービスアカウントで実行）
- 簡易リリース: Expo または React Native CLI（要ネイティブ機能で選択）

フェーズ 0 — 準備（現状）
目的
- 開発環境とリポジトリを整え、KMZ→GeoJSON スクリプトと Firestore インポートスクリプトのベースを用意する。

主なタスク
- リポジトリ初期化、ブランチ作成、README 整備（完了）
- SSH 設定（完了）
- KMZ→GeoJSON と import スクリプトの雛形作成（完了）

成果物
- GitHub リポジトリ + PR（#1）
- scripts/kmz_to_geojson.js, scripts/import_geojson_to_firestore.js

概算時間: 0.5〜2 日（既に実施済み）

フェーズ 1 — データパイプライン確立
目的
- KMZ を安定して GeoJSON に変換し、Firestore へ正しく格納するワークフローを確立する。

主なタスク
- KMZ→GeoJSON スクリプトの完成（属性マッピング、ジオタイプチェック、ジオメトリ検証）
- GeoJSON スキーマ決定（必須 properties、id の取り扱い）
- import スクリプト改良（バルク書き込み、エラーハンドリング、id ロジック）
- テスト用 KMZ で変換テスト・サンプル確認
- Firestore ルールとインデックス方針の策定

成果物
- 変換済 GeoJSON（サンプル）、import スクリプト、手順書

概算時間: 1〜3 日

受け入れ基準
- 実データの KMZ を変換し、GeoJSON の coordinates/properties が想定どおりであること
- import が成功し、Firestore に期待されるドキュメントが作成されること

フェーズ 2 — Firestore モデルと管理機能
目的
- アプリが利用しやすいデータモデル（コレクション/ドキュメント）を決め、管理ワークフローを整備する。

主なタスク
- Firestore コレクション設計（例: locations）
- 必要インデックスの決定
- import の id 戦略（上書き or 新規）
- 管理用スクリプト（差分更新、削除、ロールバック）
- （任意）簡易管理用 Web UI

成果物
- Firestore 設計ドキュメント、管理スクリプト

概算時間: 1〜3 日

フェーズ 3 — モバイルアプリ MVP（React Native）
目的
- 地図表示と地点一覧／詳細ができる最小限のアプリを提供する。

主な機能（MVP）
- Firestore から地点取得し地図に表示（マーカー）
- マーカータップで詳細表示（名称・属性・写真等）
- 簡易検索/フィルタ
- 設定画面（API/projectId 切替）

技術候補
- Expo managed workflow（素早い開発）または React Native CLI（ネイティブ機能時）
- 地図: react-native-maps または Mapbox
- Firebase 接続: @react-native-firebase/* または firebase JS SDK（Expo を使う場合）

主なタスク
- プロジェクト初期化（Expo 推奨）
- Firestore 読取実装（ページング含む）
- 地図レンダリングと詳細画面
- 環境管理（.env 等）

成果物
- iOS/Android で動くアプリ（Expo URL またはビルド成果

