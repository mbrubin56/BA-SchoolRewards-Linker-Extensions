// ==UserScript==
// @name           Brittan Acres Amazon SchoolRewards Linker
// @namespace      http://mark.rubin@gmail.com/brittanacres/schoolrewards
// @description    Ensures that your purchases on Amazon get credited to Brittan Acres' SchoolRewards program
// @include        http://www.amazon.com/*
// @include        https://www.amazon.com/*
// ==/UserScript==

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
function parseUri (str) {
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
};

parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};

function replaceQueryString(url,param,value) {
    var re = new RegExp("([?|&])" + param + "=.*?(&|$)","i");
    if (url.match(re)) {
        return url.replace(re,'$1' + param + "=" + value + '$2');
    } else if (url.indexOf("?") == -1) {
        return url + "?" + param + "=" + value;
    } else {
        return url + '&' + param + "=" + value;
    }
}

if(window == top) {
    var 
    K_TAG_KEY = "tag",
    K_BA_TAG_NAME = "britacreelem-20",
    newUrl = null,    
    currTag = parseUri(window.location.href).queryKey.tag;    
    
    if(!currTag || currTag !== K_BA_TAG_NAME) {
        newUrl = replaceQueryString(window.location.href, "tag", K_BA_TAG_NAME);
    }
    
    if(newUrl) {
        window.location.href = newUrl;
    }
}
