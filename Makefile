.PHONY: setup bootstrap db-migrate db-seed functions-serve ios-project fmt lint

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
	swiftformat apps/ios/Placewise

lint:
	swiftlint --strict --config .swiftlint.yml || swiftlint --strict
