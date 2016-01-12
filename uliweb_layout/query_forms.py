from uliweb import form
from uliweb.form.layout import QueryLayout

class QueryForm(form.Form):
    form_buttons = form.Button(value=_('Search'),
                               _class="btn btn-primary btn-flat btn-xs search",
                               type='submit')
    layout_class = QueryLayout
    form_method = 'GET'

    def post_html(self):
        buf = """
<style>
table.query {margin-bottom:5px;}
table.query label {margin-bottom:0px;display:inline;}
table.query td {padding-right:5px;}
table.query .search{margin-left:10px;}
</style>
<script>
$(document).ready(function(){
    $('#query_div').hide();
    $('#more_query').click(function(){
        $('#query_div').toggle();
        $('#more_query').toggleClass("foldup")
    });
});
</script>
    """
        return buf
