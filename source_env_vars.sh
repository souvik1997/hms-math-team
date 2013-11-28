heroku config:pull && sed -i "s/^/export /g" .env && sed -i "/.*PATH.*/d" .env
