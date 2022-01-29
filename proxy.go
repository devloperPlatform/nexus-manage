package main

import (
	"github.com/devloperPlatform/go-gin-base/ginbase"
	"github.com/gin-gonic/gin"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func proxyReq(ctx *gin.Context, path string, modifyResponse func(*http.Response) error) {
	uri, err := url.Parse(nexusUrl + path)
	if err != nil {
		ctx.JSON(500, ginbase.HttpResultUtil().NewErrorHttpResultWithMsg("转换URL失败: " + err.Error()))
		return
	}

	serverProxy := httputil.ReverseProxy{
		Director: func(request *http.Request) {
			request.URL = uri
		},
		ModifyResponse: modifyResponse,
	}
	serverProxy.ServeHTTP(ctx.Writer, ctx.Request)
}
