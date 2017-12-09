$(document).ready(function(){
    if (window.location.pathname == '/'){
  $("#myRange").on("input",function(){
       $("#silderValue").html("");
      $("#silderValue").append("<h3>"+$(this).val()+"</h3>")
  });
  
  $("#bidSubmit").off('click').on("click",function(e){
      e.preventDefault();
      var username = $(this).val();
      var value=  $("#myRange").val();
      $.post("/bidspavan",{username:username,value:value},function(res){
          
      });
  });
 // var bidWinner,bidWinnerValue=0;
  /*window.setInterval(function(){
      $.get("/bids",function(data){
          data.allBids.sort(function (a, b) {
        return b.value - a.value;
        });
          $("#bidupdate").html("<h3>Leader Board</h3>");
          data.allBids.forEach(function(bid){
               $("#bidupdate").append("<h4>"+bid.username+":"+bid.value);
          });
      });
  },1000);*/
  
function displayWinner(bidData,allitems,ithBid){
    var nextBidTime = 10;
    var z=setInterval(function(){
        $("#bidstart").html("");
        $("#bidstart").append("<p>Congratulations "+bidData.allBids[0].username+" bought "+allitems[ithBid].itemname +" for"+bidData.allBids[0].value+
        "Next Bid Starts in"+nextBidTime--);
        $("#bidstart").show();
    $("body .disable").css("opacity",0.2);
    if(nextBidTime<0){
    $("#bidstart").hide();
    $("body .disable").css("opacity",1);
    clearInterval(z);
    ithBid++;
    if(ithBid<allitems.length){
    startBidding(allitems,ithBid);    
    }else{
        $("#bidstart").html("");
        $("#bidstart").append("<p>The Bidding bid has ended</p>");
        $("#bidstart").show(); 
    $("body .disable").css("opacity",0.2);
    }
    }
    },1000);
    
}

function updateData(bidData,boughtItem){
    console.log("before posting "+boughtItem);
    $.post("/updatebid",{bidData:bidData,boughtItem:boughtItem},function(res){
        
    });
    
}

function showItem(allitems,ithBid){
    $("#showitem").html("");
    $("#showitem").append("<h1>"+allitems[ithBid].itemname+"</h1>"+
            "<img class='bid-image' src=../images/"+allitems[ithBid].images[0]+">"+
            "<h4>Item Value:"+allitems[ithBid].value+"</h4>");
            
    $("#userAmount").html("");
     $("#userAmount").append("<h3>Amount Remaing</h3>")
    $.get("/users",function(data) {
       data.allUsers.forEach(function(user){
           $("#userAmount").append("<p>"+user.username+" : "+user.amounthas+"</p>");
       });
    });
            
}
//var ithBid = 0;
var allitems;
function startBidding(allitems,ithBid){
    showItem(allitems,ithBid);
    var bidTime = 20;
    var y = setInterval(function() {
         $("#gameTimer").html("");
        $("#gameTimer").append("<span>Bid Ends In:"+bidTime--+" s</span>")
      $.get("/bids",function(data){
          $("#bidupdate").html("<h3>Leader Board</h3>");
          data.allBids.forEach(function(bid){
               $("#bidupdate").append("<h4>"+bid.username+":"+bid.value);
          });
          console.log("got bids");
      });
        if(bidTime<0){
            clearInterval(y);
            $("#gameTimer").html("");
             $("#gameTimer").append("<span>Bid Has Ended</span>");
            //var finalBidData; 
            
        $.get("/bids",function(bidData){
            console.log("got bids")
         //finalBidData = bidData;
         updateData(bidData,allitems[ithBid].itemname);
         console.log("update data called");
        displayWinner(bidData,allitems,ithBid);
        });
        //console.log("got final bid data afer "+finalBidData);
        }
    },1000);
}
 
  var countDownDate = new Date("Dec 8, 2017 23:59:00:00").getTime();

    var x = setInterval(function() {

  var now = new Date().getTime();
  //console.log(now);

  // Find the distance between now an the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  $("#bidstart").html("");
  $("#bidstart").append("<h3>Bid Starts in </h3>"+
  "<h2>"+days +"D "+hours+"H "+minutes+"M "+seconds+"S </h2>"
  );
  //document.getElementById("demo").innerHTML = days + "d " + hours + "h "
  //+ minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text 
  if (distance < 0) {
    clearInterval(x);
    $("#bidstart").hide();
    $("body .disable").css("opacity",1);
            $.get("/allItems",function(data) {
            allitems = data.allItems;
            console.log(allitems);
            startBidding(allitems,0);
        });
   /*setTimeout(function() {
       
   }, 2000);   */ 
  }
}, 1000);
    }
});