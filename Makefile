.PHONY: setup bootstrap db-migrate db-seed functions-serve ios-project fmt lint ios-build test

setup:
	bash scripts/dev-setup.sh

bootstrap:
	bash scripts/bootstrap.sh

db-migrate:
	bash scripts/db-migrate.sh

db-seed:
	bash scripts/db-seed.sh

functions-serve:
	supabase functions serve --env-file .env.local --no-verify-jwt

ios-project:
	cd apps/ios && xcodegen generate

fmt:
	swiftformat --disable trailingCommas apps/ios/Placewise apps/ios/PlacewiseTests

lint:
	swiftlint --strict --config .swiftlint.yml --no-cache

ios-build:
	cd apps/ios && xcodebuild -scheme Placewise -project Placewise.xcodeproj -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' -derivedDataPath /tmp/PlacewiseDerivedData CODE_SIGNING_ALLOWED=NO build

test:
	cd apps/ios && xcodebuild -scheme Placewise -project Placewise.xcodeproj -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 16' -derivedDataPath /tmp/PlacewiseDerivedData CODE_SIGNING_ALLOWED=NO test
