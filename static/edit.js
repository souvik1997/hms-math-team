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
	});
});
function setDimensions(){
   var windowsHeight = $('window').height()-200; //Good margin
   $('#listgroup').css('max-height', windowsHeight + 'px');
}
function toggleModal()
{
	$('#myModal').modal();
	var children = $('#pasteCatcher').children();
	for (var i = 0; i < children.length; i++)
		$(children[i]).remove();
	setUpClipboard();
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
	show(id);
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

/* http://29a.ch/2011/9/11/uploading-from-html5-canvas-to-imgur-data-uri */
function uploadimgur(canvas,btn){
	try {
		var img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
	} catch(e) {
		var img = canvas.toDataURL().split(',')[1];
	}
	$.ajax({
		url: 'https://api.imgur.com/3/image',
		type: 'post',
		headers: {
		Authorization: 'Client-ID a1ecca95edc4ebb'
		},
		data: {
		image: img
		},
		dataType: 'json',
		success: function(response) {
			if(response.success) {
				$("#myModal").modal('hide');
				$("#contentinput").val(response.data.link);
			}
		}

	});
}
function finalize()
{
	$("#pasteCatcher").prop("contenteditable", false);
	if ($("#pasteCatcher").children()[0])
	{
		var image = undefined;
		image = $("#pasteCatcher").children()[0];
		var dim = dimensions(image);
		canvas = document.createElement('canvas');
		canvas.width = dim.width;
		canvas.height = dim.height;
		ctx = canvas.getContext("2d");
		ctx.drawImage(image, 0, 0);
		//var data = canvas.toDataURL();
		uploadimgur(canvas);
	}

}
function dimensions(img_element) {
	var t = new Image();
	t.src = (img_element.getAttribute ? img_element.getAttribute("src") : false) || img_element.src;
	return {width:t.width,height:t.height};
}
/* http://joelb.me/blog/2011/code-snippet-accessing-clipboard-images-with-javascript/ */
// We start by checking if the browser supports the 
// Clipboard object. If not, we need to create a 
// contenteditable element that catches all pasted data 
function setUpClipboard()
{
	if (!window.Clipboard) {
		$("#pasteCatcher").attr("contenteditable", "");
		$("#pasteCatcher").focus();
		$(document).on("click", function() { $("#pasteCatcher").focus(); });
		$("#pasteCatcher").on("onchanged input",function() { $("#pasteCatcher").prop("contenteditable", false);})
	}
	//$(window).on("paste", pasteHandler);
	window.addEventListener("paste", pasteHandler);
	function pasteHandler(e) {
		if (e.clipboardData) {
			var items = e.clipboardData.items;
			if (items) {
				for (var i = 0; i < items.length; i++) {
					if (items[i].type.indexOf("image") !== -1) {
						var blob = items[i].getAsFile();
						var URLObj = window.URL || window.webkitURL;
						var source = URLObj.createObjectURL(blob);
						createImage(source);
						break;
					}
				}
			}
			} else {
			// This is a cheap trick to make sure we read the data
			// AFTER it has been inserted.
			setTimeout(checkInput, 1);
		}
	}
	/* Parse the input in the paste catcher element */
	function checkInput() {
		// Store the pasted content in a variable
		var child = $("#pasteCatcher").children[0];

		// Clear the inner html to make sure we're always
		// getting the latest inserted content
		$("#pasteCatcher").text = "";

		if (child) {
			// If the user pastes an image, the src attribute
			// will represent the image as a base64 encoded string.
			if (child.tagName === "IMG") {
				createImage(child.src);
			}
		}
	}
	/* Creates a new image from a given source */
	function createImage(source) {
		var pastedImage = new Image();
		pastedImage.onload = function() {
			if ($("#pasteCatcher").children().length === 0)
				$("#pasteCatcher").append(pastedImage);
		}
		pastedImage.src = source;
	}
}
