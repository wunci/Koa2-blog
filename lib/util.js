// import { parse, stringify } from 'qs';

const toolsFun = {

    delHtmlTag:function (str){
      return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
    },
    
    cutString:function(str, len, suffix) {
            if (!str) return "";
            if (len <= 0) return "";
            if (!suffix) suffix = "";
            var templen = 0;
            for (var i = 0; i < str.length; i++) {
              if (str.charCodeAt(i) > 255) {
                templen += 2;
              } else {
                templen++
              }
              if (templen == len) {
                return str.substring(0, i + 1) + suffix;
              } else if (templen > len) {
                return str.substring(0, i) + suffix;
              }
            }
            return str;
    },


  }
  
  module.exports = toolsFun



// export function cutString(str, len, suffix) {
//     if (!str) return "";
//     if (len <= 0) return "";
//     if (!suffix) suffix = "";
//     var templen = 0;
//     for (var i = 0; i < str.length; i++) {
//       if (str.charCodeAt(i) > 255) {
//         templen += 2;
//       } else {
//         templen++
//       }
//       if (templen == len) {
//         return str.substring(0, i + 1) + suffix;
//       } else if (templen > len) {
//         return str.substring(0, i) + suffix;
//       }
//     }
//     return str;
// }