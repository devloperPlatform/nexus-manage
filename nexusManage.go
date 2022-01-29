package main

import (
	"coder.byzk.cn/golibs/common/logs"
	"fmt"
	"github.com/devloperPlatform/go-auth-client"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"path/filepath"
	"strings"
	"time"
)

func initLog() {
	logFile := filepath.Join("logs", "app.log")
	if err := logs.InitDefault(&logs.Config{
		CurrentLevel: logrus.InfoLevel,
		Formatter: &logrus.TextFormatter{
			DisableQuote:    true,
			TimestampFormat: "2006-01-02 15:04:05",
		},
		PathConfig: &logs.PathConfig{
			LogPath:      logFile + ".%Y%m%d",
			LinkName:     logFile,
			MaxAge:       24 * 30 * time.Hour,
			RotationTime: 24 * time.Hour,
		},
	}); err != nil {
		panic("日志初始化失败")
	}
}

func main() {
	initLog()
	initVars()

	authService := auth.New(urlAuthServerHost, appToken, privateKeyPem, publicKeyPem)

	engine := gin.New()
	engine.Use(GinLogger(), gin.Recovery())

	authEngine := authService.GinMiddle(engine, "u_t")
	{
		authEngine.IgnoreFn(func(context *gin.Context) bool {
			url := context.Request.URL.Path
			if url == "/" || url == "/favicon.ico" || url == "/service/outreach/" {
				return true
			}

			if strings.HasPrefix(url, "/static/") || strings.HasPrefix(url, "/repository/") {
				return true
			}

			if strings.HasSuffix(url, ".js") || strings.HasSuffix(url, ".css") || strings.HasSuffix(url, ".png") || strings.HasSuffix(url, ".woff") {
				return true
			}

			return false
		})
		//authEngine.
		//	IgnoreUrl("/").
		//	IgnoreUrl("/static/nexus-coreui-bundle.css").
		//	IgnoreUrl("/static/nexus-proui-bundle.css").
		//	IgnoreUrl("/static/rapture/resources/nexus-coreui-plugin-prod.css").
		//	IgnoreUrl("/static/rapture/resources/nexus-proui-plugin-prod.css").
		//	IgnoreUrl("/static/rapture/resources/nexus-proximanova-plugin-prod.css").
		//	IgnoreUrl("/static/rapture/resources/nexus-onboarding-plugin-prod.css").
		//	IgnoreUrl("/static/rapture/resources/nexus-rapture-prod.css").
		//	IgnoreUrl("/static/nexus-rapture-bundle.css").
		//	IgnoreUrl("/static/rapture/bootstrap.js").
		//	IgnoreUrl("/static/rapture/app.js").
		//	IgnoreUrl("/NX/I18n.js").
		//	IgnoreUrl("/static/rapture/resources/loading-prod.css").
		//	IgnoreUrl("/static/rapture/resources/baseapp-prod.css").
		//	IgnoreUrl("/static/rapture/resources/fonts/proxima-nova/stylesheet.css")
	}

	authEngine.Any("*path", breakToView)
	if err := engine.Run(":8186"); err != nil {
		logs.Panic(err)
	}
}

func GinLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 开始时间
		startTime := time.Now()

		// 处理请求
		c.Next()

		// 结束时间
		endTime := time.Now()

		// 执行时间
		latencyTime := fmt.Sprintf("%6v", endTime.Sub(startTime))

		// 请求方式
		reqMethod := c.Request.Method

		// 请求路由
		reqUri := c.Request.RequestURI

		// 状态码
		statusCode := c.Writer.Status()

		// 请求IP
		clientIP := c.ClientIP()

		//日志格式
		logs.WithFields(logrus.Fields{
			"http_status": statusCode,
			"total_time":  latencyTime,
			"ip":          clientIP,
			"method":      reqMethod,
			"uri":         reqUri,
		}).Info("access")
	}
}
