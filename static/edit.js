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
function save()
{
	var id = $("#idinput").val();
	var fields = ["type","content","answer","timelimit"];
	for(var i = 0; i < fields.length; i++)
	{
		var field = fields[i];
		if (field !== "type")
		{
			$("#"+id).attr("data-"+field,$("#"+field+"input").val());
		}
		else
		{
			$("#"+id).attr("data-type",$("#mathjaxInput").prop("checked") ? "mathjax" : "image");
		}		
	}
	reload(id);
}
function add()
{
	var id = makeid(32);
	var parent = $('<a/>',{
			class:'list-group-item',
			href:'#',
			id:id,
			onclick:"show('"+id+"')",
			"data-type":"mathjax",
			"data-content":"",
			"data-answer":"",
			"data-timelimit":"",
	});
	var header = $('<h4/>',{
		class:'list-group-item-heading'
	}).append("Type: ").append($('<normal/>',{id:'typetext-'+id}).append("mathjax"));
	var body = $('<p/>',{
		class:'list-group-item-text'
	}).append("Content: ").append($('<normal/>',{id:'contenttext-'+id}).append("")).append($('<br>'))
	.append("Answer: ").append($('<normal/>',{id:'answertext-'+id}).append("")).append($('<br>'))
	.append("Time limit: ").append($('<normal/>',{id:'timelimittext-'+id}).append(""));
	$("#listgroup").append(parent.append(header).append(body));

}
function makeid(length)
{
    var text = "";
    var possible = "abcdef0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function reload(id)
{
	var fields = ["type","content","answer","timelimit"];

	for(var i = 0; i < fields.length; i++)
	{
		var field = fields[i];
		$("#"+field+"text-"+id).text($("#"+id).attr("data-"+field));
	}
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