/*
 * 定义通用的页面头，可以定义标题，副标题及面包屑
 * 示例：
 * <content-header subject="subject" sub_subject="sub-subject">
 *
 * </content-header>
*/
riot.tag2('content-header', '<section class="content-header"> <h1 if="{opts.subject}">{opts.subject} <small if="{opts.sub_subject}"></small></h1> <yield></yield> </section>', '', '', function(opts) {
});

/*
 * 定义面包屑
 */

riot.tag2('breadcrumb', '<ol> <li each="{item, i in JSON.parse(opts.items)}"> <a href="{item.href}" if="{i!=opts.items.length-1}">{item.label}</a> <virtual if="{i==opts.items.length-1}"> {item.label} </virtual> </li> </ol>', '', '', function(opts) {

  console.log(opts)
});
