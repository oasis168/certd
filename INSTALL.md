# Certd 一键部署指南

## 快速安装

在 Linux 服务器上执行：

```bash
curl -fsSL https://raw.githubusercontent.com/oasis168/certd/v2/install.sh | bash
```

### 自定义安装目录

```bash
CERTD_INSTALL_DIR=/home/user/certd curl -fsSL https://raw.githubusercontent.com/oasis168/certd/v2/install.sh | bash
```

默认安装到 `/opt/certd`。

## 环境要求

- Node.js >= 18（推荐 20）
- Git
- pnpm（脚本会自动安装）
- Linux 系统（支持 systemd）

### 安装 Node.js（如未安装）

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## 访问

安装完成后访问：

- 地址：`https://服务器IP:7002`
- 账号：`admin`
- 密码：`123456`

> 首次访问浏览器会提示证书不安全（自签名证书），点击继续访问即可。

## 更新

```bash
curl -fsSL https://raw.githubusercontent.com/oasis168/certd/v2/install.sh | bash -s update
```

更新会自动拉取最新代码、重新编译、重启服务，数据不受影响。

## 卸载

```bash
curl -fsSL https://raw.githubusercontent.com/oasis168/certd/v2/install.sh | bash -s uninstall
```

卸载时会自动备份数据目录到 `/opt/certd-data-backup-*`。

## 服务管理

安装后会注册 systemd 服务，可用以下命令管理：

```bash
sudo systemctl status certd    # 查看状态
sudo systemctl restart certd   # 重启
sudo systemctl stop certd      # 停止
sudo journalctl -u certd -f    # 查看日志
```

## 数据备份

数据目录：`/opt/certd/packages/ui/certd-server/data/`

建议定期备份此目录，包含数据库和证书文件。
