#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/home/ubuntu/stranky}"
REPO_URL="${REPO_URL:-https://github.com/KubecBubec/Dve-stranky.git}"
BRANCH="${BRANCH:-main}"

echo "Deploying ${REPO_URL} (${BRANCH}) to ${APP_DIR}"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required on the server." >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required on the server." >&2
  exit 1
fi

if [ -n "${COMPOSE_COMMAND:-}" ]; then
  read -r -a compose_command <<< "${COMPOSE_COMMAND}"
elif docker compose version >/dev/null 2>&1; then
  compose_command=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  compose_command=(docker-compose)
else
  echo "Docker Compose is required on the server." >&2
  echo "Install the Docker Compose plugin or docker-compose, then rerun this script." >&2
  exit 1
fi

if [ ! -d "${APP_DIR}/.git" ]; then
  echo "Git repository not found in ${APP_DIR}; bootstrapping from GitHub."
  parent_dir="$(dirname "${APP_DIR}")"
  temp_dir="${APP_DIR}.new"
  backup_dir="${APP_DIR}.backup-$(date +%Y%m%d%H%M%S)"

  mkdir -p "${parent_dir}"
  rm -rf "${temp_dir}"
  git clone --branch "${BRANCH}" "${REPO_URL}" "${temp_dir}"

  if [ -f "${APP_DIR}/.env" ]; then
    cp "${APP_DIR}/.env" "${temp_dir}/.env"
  fi

  if [ -d "${APP_DIR}" ]; then
    mv "${APP_DIR}" "${backup_dir}"
    echo "Previous app directory moved to ${backup_dir}"
  fi

  mv "${temp_dir}" "${APP_DIR}"
fi

cd "${APP_DIR}"

git fetch origin "${BRANCH}"
git reset --hard "origin/${BRANCH}"

if [ ! -f ".env" ]; then
  echo "Missing ${APP_DIR}/.env. Create it from .env.example before deploying." >&2
  exit 1
fi

"${compose_command[@]}" up -d --build --remove-orphans
"${compose_command[@]}" ps

docker image prune -f >/dev/null 2>&1 || true

echo "Deploy finished successfully."
