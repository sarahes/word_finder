// JavaScript Document

(function( $ ) {
	
	var pattern 	= new RegExp();
	var word_array  = new Array();	
	var new_array = new Array();
	var words;
	
	var methods = {
		
		//Intended for the textarea containing the words to search for
		//Initializes the regex.
		addWords : function() {
			
			var words = this.val().split("\n");
			
			for (var i = 0; i < words.length; i++) {
				if (words[i] != "")
					word_array.push(jQuery.trim(words[i]));
			}
			
			//Clear input box
			this.val(" ");
			
			//Update the list display
			methods.updateList();
		},
		
		
		
		//Parses the array for elements and displays them in the "searching for" list	
		updateList : function () {			
			var list = $(".selector_result ul");
			list.empty();			
			
			//Checks array for duplicates first				  
			outer: for(var i=0; i<word_array.length;i++ ){  
				for(var j=0; j<new_array.length;j++ ){
					if(new_array[j]==word_array[i]) 
						continue outer;
					}					
				new_array[new_array.length] = word_array[i];				
			}
			
			//Display the new array in the workbank list			
			for (var i = 0; i < new_array.length; i++) {
					list.append("<li>" + new_array[i] + "</li>");				
			}
			
			//If it's empty after all that, make it "empty"
			if (list.children().length == 0)
				list.append('<li class="empty">Nothing yet!</li>');				
			
			words = word_array.join("|");			
		},		
		
		clearWords : function() {	
			word_array.length = 0;
			new_array.length = 0;
			words = 0;			
			var list = $(".selector_result ul");			
			list.empty();
			list.append('<li class="empty">Nothing yet!</li>');			
		},
		
				
		//This is called automatically when using findWord() with no arguments. 
		//This will be called on the input wysiwyg in order to run the text through the regex and highlight everything	
		process : function () {
						
			var input = this.html();
			
			var result = input.replace(RegExp('\\b('+words+')\\b', 'gi'), replacer);
			
			function replacer (str, p1, offset, s) {
				return "<strong class=\"found\">" + p1 + "</strong>";
			}
			$("#destination").val(result).wysiwyg();
			$(".loading").remove();
		},
		
	};
	
	$.fn.findWord = function( method ) {    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.process.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.findWord' );
    }   
  };
  
})( jQuery );
	
$(document).ready(function(){
	/*** INITIALIZE ***/
	$("#source").val('');
	$("#destination").val('');
	$("#source").wysiwyg();
	$("#input, #result, #destination").width($("div.wysiwyg").width());	

	/*** LISTENERS ***/	
	$(".addwords").click(function(e){
		$(".mywords").findWord("addWords");
	});		
	
	$(".clear").click(function(e){			
			$(".mywords").findWord("clearWords");			
			e.preventDefault();
	});		
		
	$(".submit").mousedown(function(){
		$(this).css("background-position", "0 -32px");
		$("<div class='loading' />").insertAfter("#result h2");
		$("#destination").wysiwyg("destroy");
	});
	$(".submit").mouseup(function(){
		$(this).css("background-position", "0 0");
	});
	$(".submit").click(function(e){			
		$("div.wysiwyg iframe").contents().find('body.wysiwyg').findWord();				
		e.preventDefault();
		
	});		
	
	$(".reset").mousedown(function(){
		$(this).css("background-position", "0 -23px");
	});
	$(".reset").mouseup(function(){
		$(this).css("background-position", "0 0");
	});
	$(".reset").click(function(e){
		$("#source").wysiwyg("clear");
		$("#destination").wysiwyg("clear");
		e.preventDefault();
	});	
	
});
