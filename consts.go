package main

import (
	"coder.byzk.cn/golibs/common/logs"
	"os"
)

var (
	nexusUrl          string
	nexusAdminUser    string
	nexusAdminPasswd  string
	appToken          string
	privateKeyPem     string
	publicKeyPem      string
	urlAuthServerHost string
)

func initVars() {
	nexusUrl = getEnv("NEXUS_URL", "http://127.0.0.1:8081")
	nexusAdminUser = getEnv("NEXUS_ADMIN_USERNAME", "admin")
	nexusAdminPasswd = getEnv("NEXUS_ADMIN_PASSWD", "flovex1314..")
	urlAuthServerHost = getEnv("AUTH_SERVER_URL", "127.0.0.1:8181")
	appToken = getEnv("TOKEN", "ae05df466d9affa51d4651e9dedca1d1")
	privateKeyPem = getEnv("PRIVATE_KEY", `-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqBHM9VAYItBHkwdwIBAQQgUZnzHZGuTJWs1ZxI
n7HH8bsbchkRDEDGLnJ5xumsOp2gCgYIKoEcz1UBgi2hRANCAAR//j5V6N9VTi0Z
yZr+U9cRK4AVeW3ntRPSpmVhQeQqYVX/ykz8Zb2feR8eWEW5iYquZMhcyL4IxSK2
W9Dyyh6a
-----END PRIVATE KEY-----
`)
	publicKeyPem = getEnv("PUBLIC_KEY", `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoEcz1UBgi0DQgAEfnZkHA6mL0bUzQSyny6I97yAZQ0u
xyQOSoxg2lxUEuMOavKfg6EblfrK8Yo7BQ4f7tVANIQL7l2bOG6UK8uw1A==
-----END PUBLIC KEY-----
`)
}

func getEnv(name, defaultValue string) string {
	val := os.Getenv(name)
	if val == "" {
		val = defaultValue
	}
	logs.Debugf("获取环境变量[%s]的值为: %s", name, val)
	return val
}
