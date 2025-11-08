#!/bin/bash

# PostgreSQL 管理脚本
# 使用方法: ./scripts/postgres.sh [start|stop|status|restart]

PGDATA="/usr/local/var/postgres"
PGLOG="/usr/local/var/postgres/server.log"

case "$1" in
  start)
    echo "启动 PostgreSQL 服务..."
    pg_ctl -D "$PGDATA" -l "$PGLOG" start
    ;;
  stop)
    echo "停止 PostgreSQL 服务..."
    pg_ctl -D "$PGDATA" stop
    ;;
  status)
    echo "检查 PostgreSQL 服务状态..."
    pg_ctl -D "$PGDATA" status
    ;;
  restart)
    echo "重启 PostgreSQL 服务..."
    pg_ctl -D "$PGDATA" stop
    sleep 2
    pg_ctl -D "$PGDATA" -l "$PGLOG" start
    ;;
  *)
    echo "使用方法: $0 {start|stop|status|restart}"
    exit 1
    ;;
esac

exit 0

