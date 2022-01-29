package main

import (
	"bytes"
	_ "embed"
	"encoding/base64"
	"github.com/devloperPlatform/go-auth-client"
	"github.com/devloperPlatform/go-base-utils/commonvos"
	"github.com/devloperPlatform/go-gin-base/ginbase"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"
	"strings"
)

var (
	//go:embed raptureProdJs.js
	raptureProdJs    []byte
	raptureProdJsLen = strconv.Itoa(len(raptureProdJs))
)

var (
	breakToView auth.UserAuthFun = func(user *commonvos.InsideUserInfo, context *gin.Context) {
		p := context.Param("path")
		if strings.HasSuffix(p, "/") {
			p = p[:len(p)-1]
		}
		switch p {
		case "":
			fallthrough
		case "/index":
			breakToIndex(context)
		case "/static/rapture/nexus-rapture-prod.js":
			replaceSignJs(context)
		default:
			proxyReq(context, context.Request.RequestURI, nil)
		}
	}

	replaceSignJs gin.HandlerFunc = func(context *gin.Context) {
		proxyReq(context, context.Request.RequestURI, func(response *http.Response) error {
			response.Header["Content-Length"] = []string{raptureProdJsLen}
			response.Body = ioutil.NopCloser(bytes.NewReader(raptureProdJs))
			return nil
		})
	}

	breakToIndex gin.HandlerFunc = func(context *gin.Context) {
		resp, err := http.PostForm(nexusUrl+"/service/rapture/session", url.Values{
			"username": []string{base64.StdEncoding.EncodeToString([]byte(nexusAdminUser))},
			"password": []string{base64.StdEncoding.EncodeToString([]byte(nexusAdminPasswd))},
		})
		if err != nil {
			ginbase.HttpResultUtil().NewErrorHttpResultWithMsg("身份认证失败!")
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != 204 {
			ginbase.HttpResultUtil().NewErrorHttpResultWithMsg("身份认证响应错误: " + resp.Status)
			return
		}

		proxyReq(context, "/", func(response *http.Response) error {
			response.Header["Set-Cookie"] = resp.Header.Values("Set-Cookie")
			return nil
		})
	}
)
