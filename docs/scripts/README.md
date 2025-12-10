## Скрипты обновления ядра

В этой папке находятся утилиты для синхронизации `packages/core` из официального репозитория (`origin/main`) в вашу ветку обновления.

Файл `update-core-from-origin.sh` — bash-скрипт для автоматического выполнения следующих шагов:

- Получить изменения из `origin`.
- Переключиться на ветку `update-core-from-origin-main` (создать, если нет).
- Создать резервную ветку `backup/dev-before-sync-<timestamp>`.
- Скопировать `packages/core` из `origin/main`.
- Закоммитить и запушить изменения в ваш форк (`my`) в ветку `dev`.

Пример использования:

```bash
# дать права на исполнение (если ещё не заданы)
chmod +x docs/scripts/update-core-from-origin.sh

# запустить синхронизацию
docs/scripts/update-core-from-origin.sh

# или выполнить dry-run (не будет пуша):
docs/scripts/update-core-from-origin.sh -n
```

Параметры скрипта:

- `-s <source-ref>` — ветка/реф в origin (по умолчанию `origin/main`)
- `-b <branch>` — локальная рабочая ветка (по умолчанию `update-core-from-origin-main`)
- `-r <push-remote>` — remote для пуша (по умолчанию `my`)
- `-t <push-branch>` — ветка на remote для пуша (по умолчанию `dev`)
- `-n` — dry run (не пушить)

Перед использованием убедитесь, что в вашем репозитории настроены remotes `origin` (официальный) и `my` (ваш форк).
