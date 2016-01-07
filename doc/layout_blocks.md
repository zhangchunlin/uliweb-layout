# layout 模板布局说明

本文为说明每个模板的布局结构,其中 `[xxx]` 用来表示一个 `block`.

## layout/basic.html

```
[head //HTML head定义
<head>
    [meta //meta缺省定义
    ...
    ]
    <!-- toplinks --> //use资源插入点

    [resources //资源定义,css, js等]
    <title>[title //标题]</title>
]

[body // body 定义
<body>
    [container //内容定义]
</body>
]
```

## layout/basic_admin.html (extend layout/basic.html)

```
[head //HTML head定义
<head>
    [meta //meta缺省定义
    ...
    ]
    <!-- toplinks --> //use资源插入点

    [resources //资源定义,css, js等
        //use jquery, bootstrap3, fontawsome, ioncions, adminlte, requirejs
        [pagecss //页面内自定义css]
    ]
    <title>[title //标题]</title>
]

[body // body 定义
<body id="layout-body" class="
    [block body_class //theme 样式,缺省为skin-blue]
        sidebar-mini">

    [container //内容定义
        <div class="wrapper">
            [topbar //include inc_topbar.html
                <header class="main-header">
                    [header_logo]
                </header>

                [header_menu
                    [navbar_custom_menu //include inc_custom_menu.html]
                ]
            ]

            [side_bar //include inc_sidebar.html
                <aside class="main-sidebar">
                    <section class="sidebar">
                        [sidemenu //include inc_sidemenu.html]
                    </section>
                </aside>
            ]


            [content_wrapper //include inc_content_wrapper.html
                <div class="content-wrapper">
                    [content_header
                        [content_header_title]
                        [content_header_breadcrumb]
                    ]

                    [content
                        <section class="content">
                            [content_main]
                        </section>
                    ]
                </div>
            ]
        </div>

    ]
</body>
]
```