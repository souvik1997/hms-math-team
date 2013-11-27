var instructions = [];
$(function(){
	instructions =instructions.concat("BEGIN");
});
function del()
{
	var id = $("#idinput").val();
	$("#"+id).remove();
	if ($(".list-group-item"))
		show($(".list-group-item").attr("id"));
}
function edit(id,field,newval)
{
	var id = $("#idinput").val();
	$("#"+id).attr("data-"+field,newval);
}
function add(type,data,time,answer)
{
	
}
function show(id)
{
	var type = $("#"+id).attr("data-type");
	var content = $("#"+id).attr("data-content");
	var answer = $("#"+id).attr("data-answer");
	var timelimit = $("#"+id).attr("data-timelimit");
	$("#contentinput").val(content);
	$("#answerinput").val(answer);
	$("#timelimitinput").val(timelimit);
	$("#idinput").val(id);
	if (type === "mathjax")
	{
		$("#mathjaxInput").prop("checked",true);
		$("#imageInput").prop("checked",false);
	}
	else
	{
		$("#mathjaxInput").prop("checked",false);
		$("#imageInput").prop("checked",true);
	}

}