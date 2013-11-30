var instructions = [];
$(function(){
	instructions =instructions.concat("BEGIN");
	setDimensions();
	$('#submit-btn')
      .click(function () {
        var btn = $(this)
        btn.button('loading')
        setTimeout(function () {
          btn.button('reset')
        }, 3000)
      })
});
function setDimensions(){
   var windowsHeight = $('window').height()-200; //Good margin
   $('#listgroup').css('max-height', windowsHeight + 'px');
}
function toggleModal()
{
	$('#myModal').modal();
}
function del()
{
	var id = $("#idinput").val();
	$("#"+id).remove();
	if ($(".list-group-item"))
		show($(".list-group-item").prop("id"));
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
			$("#"+id).attr("data-type",$("#mathjaxInput").prop("checked") ? "mathjax" : ($("#imageInput").prop("checked")? "image" : "plaintext"));
		}		
	}
	reload(id);
	show(id);
}
function add()
{
	var id = makeid(25); //default length for mongodb
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
function submit()
{
	save();
	var str = "data="+JSON.stringify(mkJSON());
	str = str.replace(/\+/g,"\\\\plus");
	$.post("/admin/update/"+$("#listgroup").attr("data-category"),str);
}
function mkJSON()
{
	var arr = $("#listgroup").children();
	var obj = {data:[]}; //Wrapper for extensibility

	category = $("#listgroup").attr("data-category");
	for(var i = 0; i < arr.length; i++)
	{ 
		arr[i] = $(arr[i]).attr("id");
	}
	for(var i = 0; i < arr.length; i++)
	{ 
		var data = extract(arr[i]);
		data.category = category;
		obj.data.push(data);
	}
	return obj;
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
function extract(id,e)
{
	if (!e)
	{
		var type = $("#"+id).attr("data-type");
		var content = $("#"+id).attr("data-content");
		var answer = $("#"+id).attr("data-answer");
		var timelimit = $("#"+id).attr("data-timelimit");
		return {type:type, content:content,answer:answer,timelimit:timelimit};
	}
	else
	{
		var type = escape($("#"+id).attr("data-type"));
		var content = escape($("#"+id).attr("data-content"));
		var answer = escape($("#"+id).attr("data-answer"));
		var timelimit = escape($("#"+id).attr("data-timelimit"));
		return {type:type, content:content,answer:answer,timelimit:timelimit};
	}
}
function show(id)
{
	var obj = extract(id);
	$("#contentinput").val(obj.content);
	$("#answerinput").val(obj.answer);
	$("#timelimitinput").val(obj.timelimit);
	$("#idinput").val(id);
	if (obj.type === "mathjax")
	{
		$("#mathjaxInput").prop("checked",true);
		$("#uploadbtn").attr("disabled",true);
		//$("#imageInput").prop("checked",false);
	}
	else if (obj.type === "image")
	{
		//$("#mathjaxInput").prop("checked","false");
		$("#imageInput").prop("checked","true");
		$("#uploadbtn").attr("disabled",false);
	}
	else
	{
		$("#plaintextInput").prop("checked",true);
		$("#uploadbtn").attr("disabled",true);
	}

}