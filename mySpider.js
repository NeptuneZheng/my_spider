/**
 * Created by ZHENGNE on 5/24/2018.
 */
const http = require("http"),
    url = require("url"),
    superagent = require("superagent"),
    fs = require("fs"),
    cheerio = require("cheerio"),
    async = require("async"),
    emailsender = require('./email_sender'),
    eventproxy = require('eventproxy');

var ep = new eventproxy();

var catchFirstUrl = 'http://www.hust1st.com/',	//入口页面
    deleteRepeat = {},	//去重哈希数组
    urlsArray = [],	//存放爬取网址
    catchDate = [],	//存放爬取数据
    pageUrls = [],	//存放收集文章页面网站
    pageNum = 200,	//要爬取文章的页数
    startDate = new Date(),	//开始时间
    endDate = false;	//结束时间

pageUrls.push(catchFirstUrl);

function start(){
    // 根据URL list抓取页面信息
    pageUrls.forEach(function (pageURL) {

        superagent.get(pageURL).end(function (err,res) {
            let $ = cheerio.load(res.text);
            // fs.writeFile('./data.txt',res.text,'utf8',function (err) {
            //     if(err){
            //         console.log("write file ./data.txt fail.")
            //     }else {
            //         console.log("write file ./data.txt success.")
            //     }
            // });
            //formTab610/newsList400
            let info = $("#formTab610");
            // let news_title_arr = info.find(".formTabMiddle");
            let news_arr = info.find(".J_newsListLine");

            // news_title_arr.each(function (idx,elem) {
            //     title_map.key = idx;
            //     title_map.value = analysis(elem,'div')
            // });

            news_arr.each(function (sub_new_idx,sub_new_item) {
                let news_info = $(sub_new_item).find(".fk-newsListTitle");
                let date = $(sub_new_item).find(".J_newsCalendar");

                var str = '';
                for(var i=0; i < news_info.length;i++){
                    str += analysis(news_info[i],'a');
                    str += ': ' + analysis(date[i],'a');
                    str += '\r\n';
                }
                if(catchDate.indexOf(str) < 0){
                    catchDate.push(str)
                }

                // console.log(str)
            });
            emailsender.sendEmail('1358454960@qq.com','华中科技大学同济医学院学院第一临床学院信息快递',create_email_html(catchDate));
            console.log(catchDate.toString())
        });
    });

    var analysis = function (node,node_name) {
        var result = '';
        if(node.name == node_name && node.children != null){
            node.children.forEach(function (a_item,a_idx) {
                // console.log(a_item.data);
                result = a_item.data
            })
        }else if(node.children != null && node.children.length > 0){
            node.children.forEach(function (sub_node,sub_idx) {
                var sub_result = analysis(sub_node,node_name);
                if(sub_result){
                    result = sub_result
                }
            });
        }
        return result
    };

    var create_email_html = function(infos){
        var output = '<h2>http://www.hust1st.com/</h2><h3>';
        infos.forEach(function (elem,idx) {
            if(elem.indexOf('住培') > -1 || elem.indexOf('规范化培训') > -1 || elem.indexOf('招录' ) > -1){
                output += '<h4><p style="color: deeppink">'+elem+'</p></h4>'
            }else {
                output += '<h5><p style="color: darkgray">'+elem+'</p></h5>'
            }

        });

        return output+'</h3>'
    };
}

exports.myStart = start;
