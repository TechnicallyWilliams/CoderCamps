var MasterObject = {};

var allUsersHolder = [];
var myFriends = [];
var myProfile = {};
var currentUser = "Dexter Williams";
var friendProfiles = [];
var callBackArray = [];
var friendTweets = [];
var myTweets = [];
var myProfileArray = [];
var allTweets = [];
var loopSwitch = false;

MasterObject.MasterAjaxCall = function (checkFriends, getProfiles, getTweets, editFriends, changeProfile, theObject, TheURL) {

    var theUrlBase = ".firebaseio.com/";
    var theBlueprint = ".json";
    var urlSegOne = "https://campr";
    var myUrlSeg = "https://chirp-now";
    var callFirebase = new XMLHttpRequest();

    //////////////////////////////GET//////////////////////////////////

    //Get friends
    if (checkFriends === true && getProfiles === null) {
        var getMyFriends = function (placeHolder) {
            console.log("Getting my Friends");
            var newHolder = placeHolder;
            callFirebase.open("GET", myUrlSeg + theUrlBase + TheURL + theBlueprint);
            callFirebase.onload = function () {
                if (this.status >= 200 && this.status < 400) {
                    console.log("Get Friends Response");
                    var groupOfFriends = JSON.parse(this.response);
                    newHolder(groupOfFriends);
                    checkFriends = false;
                } else {
                    alert("Server responded but something is wrong");
                }
            };
            callFirebase.onerror = function () {
                alert(this.response + ":" + "" + "SERVER 'GET' ERROR");
            }; callFirebase.send();

        }; getMyFriends(function (groupOfFriends) {
            for (var friends in groupOfFriends) {
                groupOfFriends[friends].Guid = friends;
                myFriends.push(groupOfFriends[friends]);
            };
            for (var friends in myFriends) {
                console.log("The name" + myFriends[friends].name);
            };
            MasterObject.MasterAjaxCall(null, true, null, null, null, null, "/profile/");
        });
    };


    //Organize Profiles
    if (getProfiles === true && checkFriends === null) {

        //Organize Profiles
        var searchProfiles = function (holder1, findUsers, holder2, friendsProfiles, holder3, findMyProfile) {

            if (findUsers) {
                var firstHolder = holder1;
                console.log("Getting every User");
                callFirebase.open("GET", urlSegOne + theUrlBase + theBlueprint);
                callFirebase.onload = function () {
                    if (this.status >= 200 && this.status < 400) {
                        var everyUser = JSON.parse(this.response);
                        console.log("This should be everyUser:" + everyUser);
                        firstHolder(everyUser);
                    } else {
                        alert("server responded but something is wrong");
                    }
                };
                callFirebase.onerror = function () {
                    alert(this.response + ":" + "" + "SERVER 'GET' ERROR");
                };
                callFirebase.send();
            }

            //Get profile of every friend
            var counter = 0;
            if (friendsProfiles) {
                var beginLoop = function () {
                    if (counter < (myFriends.length - 1)) {
                        callFirebase.open("GET", myFriends[counter].url + "/" + TheURL + theBlueprint);
                        counter++;
                        callFirebase.onload = function () {
                            if (this.status >= 200 && this.status < 400) {
                                var eProfile = JSON.parse(this.response);
                                console.log("This is a profile:" + eProfile);
                                holder2(eProfile);
                            } else {
                                alert("server responded but something is wrong");
                            }
                        };
                        callFirebase.onerror = function () {
                            alert(this.response + ":" + "" + "SERVER 'GET' ERROR");
                        }; callFirebase.send();
                    } else {
                        clearInterval(end);
                        console.log("The begin function shouldn't be called after this message");

                        //get my profile
                        searchProfiles(null, null, null, null, function (callback3) {
                            var u = "<div width='20%' border='1' class='container: fluid'>";
                            var v = "<div width='20%' border='1' class='container: fluid'>";
                            var w = "<div width='20%' border='1' class='container: fluid'>";
                            console.log("Looking for a guid" + callback3);

                            myProfile = callback3;
                            for (var category in myProfile) {
                                if (category === "picture") {
                                    w += "<img  style='height: 220px; width: 220px;' '" + myProfile[category];
                                }
                                else if (category === "username") {
                                    w += "<p>" + "<button class='btn btn-primary btn-large' onclick='editMode()'" + "id=" + "jkl" + i + ">" + "Edit" + "</button>" + "</p>";
                                } else {
                                    w += "<p>" + "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + myProfile[category] + "</p>";
                                }
                            };
                            for (var i = 0; i < myFriends.length; i++) {
                                v += "<p>" + myFriends[i].name + " " + "<button class='btn btn-primary btn-large' onclick=\"unFollow('" + myFriends[i].name + "')\" id=" + "ghi" + i + "> unfollow" + "</button>" + "</p>";
                                for (var j = 0; j < friendProfiles.length; j++) {
                                    if (friendProfiles[j].name === myFriends[i].name) {
                                        u += "<p>" + myFriends[i].name + " " + myFriends[i].url + " " + friendProfiles[j].bio + "<button class='btn btn-primary btn-large' onclick=\"unFollow('" + myFriends[i].name + "')\" id=" + "abc" + i + "> unfollow" + "</button>" + "</p>";
                                    } else {
                                        console.log("there is no match");
                                    }
                                };
                            }; u += "</div>";
                            v += "</div>";
                            w += "</div>";
                            document.getElementById("allProfiles").innerHTML = u;
                            document.getElementById("allFriends").innerHTML = v;
                            document.getElementById("myProfile").innerHTML = w;
                        }, true);
                        MasterObject.MasterAjaxCall(null, null, true, null, null, null, '/tweets/');
                    }
                }; beginLoop();
                var end = setInterval(beginLoop, 700);
            };

            //get my profile
            if (findMyProfile) {
                var thirdHolder = holder3;
                console.log("Getting my profile");
                callFirebase.open("GET", myUrlSeg + theUrlBase + TheURL + theBlueprint);
                callFirebase.onload = function () {
                    if (this.status >= 200 && this.status < 400) {
                        var myProfileObj = JSON.parse(this.response);
                        thirdHolder(myProfileObj);
                        getProfiles = false;
                    } else {
                        alert("server responded but something is wrong");
                    }
                };
                callFirebase.onerror = function () {
                    alert(this.response + ":" + "" + "SERVER 'GET' ERROR");
                };
                callFirebase.send();
            };
        }

        searchProfiles(function (callback) {
            //get every user and divide them by current friends and not current friends
            for (var user in callback) {
                allUsersHolder.push(callback[user]);
            };
            var h = "<div width='20%' border='1' class='container: fluid'>" + "<ul value='1'>";
            for (var i = 0; i < allUsersHolder.length; i++) {
                h += "" + "<li>" + allUsersHolder[i].name + " " + "<button class='btn btn-primary btn-large' onclick=\"follow('" + allUsersHolder[i].name + "')\" id=" + "def" + i + "> Follow" + "</button>" + "</li>";
            }; h += "</ul>" + "</div>";
            document.getElementById("allUsers").innerHTML = h;
            //get profile of every friend
            searchProfiles(null, null, function (callback2) {
                for (var profile in callback2) {
                    console.log("This is a callback for the profiles:" + callback2[profile]);
                    friendProfiles.push(callback2[profile]);
                };
            }, true, null, null);
        }, true, null, null, null, null);
    };

    if (getTweets && theObject) {

        document.getElementById("sendMessage").value = "";
        callFirebase.open("POST", myUrlSeg + theUrlBase + TheURL + theBlueprint);
        callFirebase.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                var newTweet = JSON.parse(this.response);
                console.log(newTweet);
                loopSwitch = true;
                MasterObject.MasterAjaxCall(null, null, true, null, null, null, '/tweets/');
                getTweets = null;
            } else {
                alert("serious error. server responded but something is wrong");
            }
        };

        callFirebase.onerror = function () {
            alert(this.response + "SERVER 'POST' ERROR");
        };

        callFirebase.send(JSON.stringify(theObject));

    } else if (getTweets) {

        if (loopSwitch) {
            console.log("The Timeout function has been called");

            var getMyTweetsAgain = function (tweetHolder) {
                console.log("Getting my tweets");
                callFirebase.open('GET', myUrlSeg + theUrlBase + TheURL + theBlueprint);
                callFirebase.onload = function () {
                    if (this.status >= 200 && this.status < 400) {
                        var allMyTweets = JSON.parse(this.response);   //when you post something, you get a json response with a firebase name/'id' //{"name":"JXDeVGdh062x6TdcWOX"} / -jxDfkvRR  
                        console.log("THere's a response:" + allMyTweets);
                        tweetHolder(allMyTweets);
                        //getFriendsTweets(function (callback) {
                        //    for (var message in callback) {
                        //        friendTweets.push(callback[message]);
                        //    };
                        //});
                        //var holdOn = function () {
                        //    console.log("called HOLDON FUNCTION");

                        //    for (var prop in friendTweets) {
                        //        console.log(friendTweets[prop].username + " " + friendTweets[prop].message + " " + friendTweets[prop].timestamp);
                        //        allTweets.push(friendTweets[prop]);
                        //    };

                        //    var anotherCounter = 0;
                        //    for (var category in allTweets) {
                        //        console.log("Inside allTweets" + anotherCounter);
                        //        anotherCounter++;
                        //        var date = new Date(allTweets[category].timestamp);
                        //        if (date.toDateString().charAt(0) === "I") {
                        //            allTweets.splice(category, 1);
                        //            console.log("This is not a number" + date);
                        //        } else {
                        //            console.log("This is a number" + date);
                        //            var newTime = date.getTime();
                        //            //console.log(typeof newTime);
                        //            allTweets[category].timestamp = newTime;
                        //        }
                        //    }; console.log("Out of the for loop");

                        //    var nearCounter = 0;
                        //    function dates_time(a, b) {
                        //        console.log(nearCounter);
                        //        nearCounter++;
                        //        console.log("This is inside organizer" + a.timestamp + " " + b.timestamp);
                        //        return a.timestamp - b.timestamp;
                        //    };
                        //    console.log("About to organize");
                        //    allTweets.sort(dates_time);

                        //    //allTweets[category].timestamp = formattedTime;
                        //    var everyTweet = "<div style='height:300px; width:500px; border:1px solid #808080; overflow:auto;'>"
                        //    for (var prop in allTweets) {
                        //        var displayDate = new Date(allTweets[prop].timestamp);
                        //        var month = displayDate.getMonth();
                        //        var day = displayDate.getDate();
                        //        var year = displayDate.getFullYear();
                        //        //// hours part from the timestamp
                        //        var hours = displayDate.getHours();
                        //        // minutes part from the timestamp
                        //        var minutes = "0" + displayDate.getMinutes();
                        //        // seconds part from the timestamp
                        //        var seconds = "0" + displayDate.getSeconds();
                        //        var formattedTime = hours + ':' + minutes.substr(minutes.length - 2) + ':' + seconds.substr(seconds.length - 2);
                        //        var dateView = month + "/" + day + "/" + year + " @ " + formattedTime;
                        //        everyTweet += "<p style='display: block;'>" + " <b>" + allTweets[prop].username + "</b>: " + allTweets[prop].message + " " + dateView + "</p>" + "<br>";
                        //    }; everyTweet += "</div>";
                        //    document.getElementById("allTweets").innerHTML = everyTweet;
                        //    document.getElementById("allTweets").innerHTML += "<input type='text' id='sendMessage' placeholder='Enter Text Here'/>" + "<button class='btn btn-primary btn-large' onclick='postChirp()' style='display:inline'> SEND/POST </button>";
                        // };  setTimeout(holdOn, 5000);
                    } else {
                        alert("server responded but something is wrong");
                    }
                };
                callFirebase.onerror = function () {
                    alert(this.response + ":" + "" + "SERVER 'GET' ERROR");
                };
                callFirebase.send();
            };

            var getFriendsTweets = function (promise) {
                var start = function () {
                    var counter = 0;
                    var slowDown = function () {
                        if (counter < myFriends.length - 1) {
                            callFirebase.open('GET', myFriends[counter].url + TheURL + theBlueprint);
                            callFirebase.onload = function () {
                                if (this.status >= 200 && this.status < 400) {
                                    var friendsTweets = JSON.parse(this.response);   //when you post something, you get a json response with a firebase name/'id' //{"name":"JXDeVGdh062x6TdcWOX"} / -jxDfkvRR  
                                    console.log("Friends Tweets" + friendsTweets);
                                    promise(friendsTweets);
                                } else {
                                    alert("server responded but something is wrong");
                                }
                            };
                            callFirebase.onerror = function () {
                                alert(this.response + ":" + "" + "SERVER 'GET' ERROR");
                            };
                            callFirebase.send();
                            counter++;
                        } else {
                            clearInterval(finish);
                        }
                    }; var finish = setInterval(slowDown, 800);
                }; start();
            };

            getMyTweetsAgain(function (callback) {
                for (var message in callback) {
                    callBackArray.push(callback[message]);
                };
                //Adding onto an array that you are looping through using dot length draws way too much memory
                var messenger = [];
                for (var i = allTweets.length - 1; i < allTweets.length; i++) {
                    console.log("This is the existing tweet" + allTweets[i]);
                    for (var j = 0; j < callBackArray.length; j++) {
                        var displayDate = new Date(callBackArray[j].timestamp);
                        var newTime = displayDate.getTime();
                        if (displayDate.toDateString().charAt(0) === "I") {
                            callBackArray.splice(j, 1);
                            console.log("This is not a number" + displayDate);
                        } else if (newTime > allTweets[allTweets.length - 1].timestamp) {
                            messenger.push(callBackArray[j]);
                            var month = displayDate.getMonth();
                            var day = displayDate.getDate();
                            var year = displayDate.getFullYear();
                            //// hours part from the timestamp
                            var hours = displayDate.getHours();
                            // minutes part from the timestamp
                            var minutes = "0" + displayDate.getMinutes();
                            // seconds part from the timestamp
                            var seconds = "0" + displayDate.getSeconds();
                            var formattedTime = hours + ':' + minutes.substr(minutes.length - 2) + ':' + seconds.substr(seconds.length - 2);
                            var dateView = month + "/" + day + "/" + year + " @ " + formattedTime;
                            document.getElementById('innerTweets').innerHTML += "<p id='testP' style='display: block;'>" + "<b>" + callBackArray[j].username + "</b>: " + callBackArray[j].message + " " + dateView + "</p>" + "</br>";
                        } else {
                            console.log("This is continuing");
                            continue;
                        }
                    };
                };

                //This needs to be organized into time in order to keep the order inside the allTweetsc
                $("#innerTweets").animate({ scrollTop: $("#innerTweets")[0].scrollHeight }, 1000);
                for (var prop in messenger) {
                    var timeNow = new Date();
                    messenger[prop].timestamp = timeNow;
                    messenger[prop].username = "#chirp_now:";
                    allTweets.push(messenger[prop])
                };

                for (var prop in messenger) {
                    while (messenger.length > 0) {
                        console.log("My Messenger Length" + messenger.length);
                        messenger.pop();
                    };
                };
                loopSwitch = true;
                var pullTweets = function () {
                    MasterObject.MasterAjaxCall(null, null, true, null, null, null, '/tweets/');
                };
                console.log("This should be the last message");
                setTimeout(pullTweets, 4000);


                //for (var prop in myTweets) {
                //    while (myTweets.length > 0) {
                //        console.log("My Tweets Length" + myTweets.length);
                //        myTweets.pop();
                //    };
                //};
                //for (var prop in friendTweets) {
                //    while (friendTweets.length > 0) {
                //        friendTweets.pop();
                //    };
                //};
                //for (var prop in allTweets) {
                //    while (allTweets.length > 0) {
                //        allTweets.pop();
                //    };
                //};

                //for (var prop in myTweets) {
                //    allTweets.push(myTweets[prop]);
                //    console.log(myTweets[prop].username + ": " + myTweets[prop].message + ": " + myTweets[prop].timestamp);
                //};
            });

        } else {

            var getMyTweets = function (tweetHolder) {
                callFirebase.open('GET', myUrlSeg + theUrlBase + TheURL + theBlueprint);
                callFirebase.onload = function () {
                    if (this.status >= 200 && this.status < 400) {
                        var allMyTweets = JSON.parse(this.response);   //when you post something, you get a json response with a firebase name/'id' //{"name":"JXDeVGdh062x6TdcWOX"} / -jxDfkvRR  
                        tweetHolder(allMyTweets);
                        getFriendsTweets(function (callback) {
                            for (var message in callback) {
                                friendTweets.push(callback[message]);
                            };
                        });
                        var holdOn = function () {
                            console.log("called HOLDON FUNCTION");

                            for (var prop in friendTweets) {
                                console.log(friendTweets[prop].username + " " + friendTweets[prop].message + " " + friendTweets[prop].timestamp);
                                allTweets.push(friendTweets[prop]);
                            };

                            var anotherCounter = 0;
                            for (var category in allTweets) {
                                console.log("Inside allTweets" + anotherCounter);
                                anotherCounter++;
                                var date = new Date(allTweets[category].timestamp);
                                if (date.toDateString().charAt(0) === "I") {
                                    allTweets.splice(category, 1);
                                    console.log("This is not a number" + date);
                                } else {
                                    console.log("This is a number" + date);
                                    var newTime = date.getTime();
                                    //console.log(typeof newTime);
                                    allTweets[category].timestamp = newTime;
                                }
                            }; console.log("Out of the for loop");

                            var nearCounter = 0;
                            function dates_time(a, b) {
                                console.log(nearCounter);
                                nearCounter++;
                                console.log("This is inside organizer" + a.timestamp + " " + b.timestamp);
                                return a.timestamp - b.timestamp;
                            };
                            console.log("About to organize");
                            allTweets.sort(dates_time);

                            //allTweets[category].timestamp = formattedTime;  border: 6px solid #949599;
                            var everyTweet = "<div id='chatBox' style='overflow: no-display; position: relative; width: 100%; height: 400px; margin-left: auto; margin-right: auto; margin-top: -60px;'>"
                            everyTweet += "<div id='innerTweets' style='opacity: 10; border-top-left-radius: 15px; border-top-right-radius: 15px; border: 6px solid #949599; background-color: white; max-height: 330px; width: 450px; overflow: auto; position: absolute; bottom: 0; margin-top: 25px; margin-left: 6px; margin-right: 0px; padding: 0px;'>"
                            for (var prop in allTweets) {
                                var displayDate = new Date(allTweets[prop].timestamp);
                                var month = displayDate.getMonth();
                                var day = displayDate.getDate();
                                var year = displayDate.getFullYear();
                                //// hours part from the timestamp
                                var hours = displayDate.getHours();
                                // minutes part from the timestamp
                                var minutes = "0" + displayDate.getMinutes();
                                // seconds part from the timestamp
                                var seconds = "0" + displayDate.getSeconds();
                                var formattedTime = hours + ':' + minutes.substr(minutes.length - 2) + ':' + seconds.substr(seconds.length - 2);
                                var dateView = month + "/" + day + "/" + year + " @ " + formattedTime;
                                everyTweet += "<p style='display: inline; font-family: Cooper;'>" + allTweets[prop].username + ":</p> <p style='display: inline;'>" + allTweets[prop].message + "</p> <p style='display: inline; font-family: Cooper;'> " + dateView + "</p>" + "<br>";
                            }; everyTweet += "</div> </div>";
                            document.getElementById("tweetsBox").innerHTML = everyTweet;
                            document.getElementById("tweetsBox").innerHTML += "<input style='margin-left: 6px; margin-top: 10px; height: 35px;' type='text' id='sendMessage' size='45' placeholder='Enter Text Here'/>" + "  " + "<button class='btn btn-primary btn-large' onclick='postChirp()' style='display:inline'> SEND/POST </button>";
                            var testZoom = document.getElementById('innerTweets');
                            $("#innerTweets").animate({ scrollTop: $("#innerTweets")[0].scrollHeight }, 1000);
                            //for (var prop in myTweets) {
                            //    while (myTweets.length > 0) {
                            //        console.log("My Tweets Length" + myTweets.length);
                            //        myTweets.pop();
                            //    };
                            //};
                            //for (var prop in friendTweets) {
                            //    while (friendTweets.length > 0) {
                            //        friendTweets.pop();
                            //    };
                            //};
                            //for (var prop in allTweets) {
                            //    while (allTweets.length > 0) {
                            //        allTweets.pop();
                            //    };
                            //};
                            loopSwitch = true;
                            MasterObject.MasterAjaxCall(null, null, true, null, null, null, '/tweets/');
                        }; setTimeout(holdOn, 7000);
                    } else {
                        alert("server responded but something is wrong");
                    }
                };
                callFirebase.onerror = function () {
                    alert(this.response + ":" + "" + "SERVER 'GET' ERROR");
                };
                callFirebase.send();
            };

            var getFriendsTweets = function (promise) {
                var start = function () {
                    var counter = 0;
                    var slowDown = function () {
                        if (counter < myFriends.length - 1) {
                            callFirebase.open('GET', myFriends[counter].url + TheURL + theBlueprint);
                            callFirebase.onload = function () {
                                if (this.status >= 200 && this.status < 400) {
                                    var friendsTweets = JSON.parse(this.response);   //when you post something, you get a json response with a firebase name/'id' //{"name":"JXDeVGdh062x6TdcWOX"} / -jxDfkvRR  
                                    console.log("Friends Tweets" + friendsTweets);
                                    promise(friendsTweets);
                                } else {
                                    alert("server responded but something is wrong");
                                }
                            };
                            callFirebase.onerror = function () {
                                alert(this.response + ":" + "" + "SERVER 'GET' ERROR");
                            };
                            callFirebase.send();
                            counter++;
                        } else {
                            clearInterval(finish);
                        }
                    }; var finish = setInterval(slowDown, 800);
                }; start();
            };

            getMyTweets(function (callback) {
                for (var message in callback) {
                    myTweets.push(callback[message]);
                };
                for (var prop in myTweets) {
                    allTweets.push(myTweets[prop]);
                    console.log(myTweets[prop].username + ": " + myTweets[prop].message + ": " + myTweets[prop].timestamp);
                };
            });
        }
    } else {
        console.log("close if statement");
    }


    ///////////////////POST////////////////

    //create a myfriends table in firebase
    if (editFriends) {

        if (editFriends && theObject.remove) {
            var unWantedObject = JSON.stringify(theObject.Guid);
            callFirebase.open("DELETE", myUrlSeg + theUrlBase + TheURL + theObject.Guid + theBlueprint);
            callFirebase.onload = function () {
                if (this.status >= 200 && this.status < 400) {
                    allUsersHolder = [];
                    myFriends = [];
                    friendProfiles = [];
                    MasterObject.MasterAjaxCall(true, null, null, null, null, null, "/friends/");
                } else {
                    alert("Server responded but something is wrong");
                }
            };
            callFirebase.onerror = function () {
                alert(this.response + ":" + "" + "SERVER 'DELETE' ERROR");
            };
            callFirebase.send(JSON.stringify(theObject.Guid));

        } else {
            var newFoundFriend = function () {
                callFirebase.open("POST", myUrlSeg + theUrlBase + TheURL + theBlueprint);
                callFirebase.onload = function () {
                    if (this.status >= 200 && this.status < 400) {
                        var newTweet = JSON.parse(this.response);   //when you post something, you get a json response with a firebase name/'id' //{"name":"JXDeVGdh062x6TdcWOX"} / -jxDfkvRR  
                        allUsersHolder = [];
                        myFriends = [];
                        friendProfiles = [];
                        MasterObject.MasterAjaxCall(true, null, null, null, null, null, "/friends/");
                    } else {
                        alert("Server responded but something is wrong");
                    }
                };
                callFirebase.onerror = function () {
                    alert(this.response + ":" + "" + "SERVER 'POST' ERROR");
                }; callFirebase.send(JSON.stringify(theObject));
            };
            newFoundFriend();
        }
    }

    if (changeProfile) {
        console.log("Made it to changeProfile");
        callFirebase.open("PATCH", myUrlSeg + theUrlBase + TheURL + theBlueprint);
        callFirebase.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                var myProfileObj = JSON.parse(this.response);   //when you post something, you get a json response with a firebase name/'id' //{"name":"JXDeVGdh062x6TdcWOX"} / -jxDfkvRR  
                console.log(myProfileObj);
                document.getElementById("myProfile").innerHTML = "Profile Updated Succesfully!";
                allUsersHolder = [];
                friendProfiles = [];
                myProfile = {};
                MasterObject.MasterAjaxCall(null, true, null, null, null, null, "/profile/");
            } else {
                alert("server responded but something is wrong");
            }
        };
        callFirebase.onerror = function () {
            alert(this.response + ":" + "" + "SERVER 'EDIT' ERROR");
        };
        callFirebase.send(JSON.stringify(theObject));
    }
};
var viewFriends = MasterObject.MasterAjaxCall(true, null, null, null, null, null, "/friends/");

//add friend
var follow = function (object) {
    console.log(object);
    if (object === currentUser) {
        return alert("You cannot add yourself");
    } else {
        for (var i = 0; i <= myFriends.length; i++) {
            if (i === myFriends.length) {
                var url = "/friends/";
                var editFriends = true;
                for (var user in allUsersHolder) {
                    if (allUsersHolder[user].name === object) {
                        var newFriend = {};
                        newFriend.url = allUsersHolder[user].url;
                        newFriend.name = allUsersHolder[user].name;
                        return MasterObject.MasterAjaxCall(null, null, null, editFriends, null, newFriend, url);
                    }
                };
            }
            else if (myFriends[i].name === object) {
                return console.log("You cannot add existing Friends");
            }
        };
    }
};


//remove Friend
var unFollow = function (object) {
    for (var i = 0; i < myFriends.length; i++) {
        if (myFriends[i].name === object) {
            console.log("This should be the ID:" + myFriends[i].Guid);
            var url = "/friends/";
            var editFriends = true;
            myFriends[i].remove = true;

            return MasterObject.MasterAjaxCall(null, null, null, editFriends, null, myFriends[i], url);
        }
    };
    //Then we can use nullable values 
};

//post a message
var postChirp = function () {
    var url = "/tweets/";
    loopSwitch = false;
    console.log("Posting Chirp");
    var messageObject = {};
    var timeNow = new Date();
    messageObject.message = document.getElementById("sendMessage").value;
    messageObject.timestamp = timeNow;
    messageObject.username = "#chirp_now:";

    return MasterObject.MasterAjaxCall(null, null, true, null, null, messageObject, url);
};

//edit Profile
var editMode = function () {

    var profileHolder = "<div width='20%' border='1' id='insideProfile' class='container: fluid' style='float: right;'>";
    profileHolder += "ImageURL:" + "<input id='imageBox' type='text' name='imageurl' value='' />";

    for (var category in myProfile) {
        if (category === 'bio') {
            profileHolder += "About: " + "<input id='bioBox' type='text' name='about' value='" + myProfile[category] + "' />";
        } else if (category === "name") {
            profileHolder += "Name:" + "<input id='nameBox' type='text' name='fullname' value='" + myProfile[category] + "' />";
        } else if (category === 'email') {
            profileHolder += "Email: " + "<input id='emailBox' type='text' name='emailname' value='" + myProfile[category] + "' />";
        } else if (category === 'username') {
            profileHolder += "'Username:'" + "<input id='userNameBox' type='text' name='username' value='" + myProfile[category] + "' />" + "<br>";
            profileHolder += "<p>" + "<button onclick='bindProfile()'>" + "Submit Changes" + "</button>" + "" + "<button onclick='cancelEdit()'>" + "Cancel" + "</button>" + "</p>" + "</div>";
            document.getElementById("myProfile").innerHTML = profileHolder;
            document.getElementById("imageBox").value = myProfile.picture;
        } else {
            continue;
        }
    };

};

var bindProfile = function () {

    myProfile.url = "https://chirp-now.firebaseio.com/";
    myProfile.name = document.getElementById("nameBox").value;
    myProfile.picture = document.getElementById("imageBox").value;
    myProfile.bio = document.getElementById("bioBox").value;
    myProfile.email = document.getElementById("emailBox").value;
    myProfile.username = document.getElementById("userNameBox").value;

    return MasterObject.MasterAjaxCall(null, null, null, null, true, myProfile, "/profile/");
};

var cancelEdit = function () {
    alert("You made it to the cancel function");
    var w = "<div width='20%' border='1' class='container: fluid'>";
    for (var category in myProfile) {
        w += "" + "<p>" + myProfile[category] + "</p>";
        if (category === "username") {
            w += "<p> <button onclick='editMode()'> Edit </button> </p>";
        }
    };
    w += "</div>";
    document.getElementById("myProfile").innerHTML = w;

};



