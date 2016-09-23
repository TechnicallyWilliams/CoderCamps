
var Masterfunction = function () {

    var currentUser = "Dexter Williams"; //Unique due to no authentication for this SPA.

    var longPollingCounter = 0;

    var DynamicAPICaller = function (verb, subUrl) { //Adding that second parameters was interesting. Now if the subUrl's grow, this doesn't have to be changed. Not even close to parameter creep
        this.theUrlBase = ".firebaseio.com/";
        this.theBlueprint = ".json";
        this.callFirebase = new XMLHttpRequest();

        this.verb = verb;
        this.sharedUrl = "https://campr";
        this.myUrl = "https://chirp-now";
        this.subUrl = subUrl;
    };

    //GET OBJECTS
    var getFriends = new DynamicAPICaller("GET", "/friends/");
    var getProfile = new DynamicAPICaller("GET", "/profile/");
    var getTweets = new DynamicAPICaller("GET", '/tweets/');

    //POST OBJECTS
    var addFriend = new DynamicAPICaller("POST", "/friends/");
    var postTweet = new DynamicAPICaller("POST", '/tweets/');

    //EDIT OBJECTS
    var editProfile = new DynamicAPICaller("PATCH", "/profile/");

    //DELETE OBJECTS
    var removeFriends = new DynamicAPICaller("DELETE", "/friends/");

    //Relationship Scope
    var relationships = function () { 
        var myFriends = [];
        var everyUser = [];
        var myProfiles = [];

        this.browseFriends = function () {
            return myFriends;
        };
        this.browseUsers = function () {
            return everyUser;
        };
        this.browseProfiles = function () {
            return myProfiles;
        };
    };

    //ALLFRIENDSOBJECT
    var allFriends = new relationships();
    var allUsers = new relationships();
    var friendsProfiles = new relationships();

    //Tweet Scope
    var defineTweets = function () {
        var myMessages = [];
        var friendsMessages = [];
        var allMessages = [];

        this.browseMyTweets = function () {
            return myMessages;
        };
        this.browseFriendsTweets = function () {
            return friendsMessages;
        };
        this.browseAllTweets = function () {
            return allMessages;
        };
    };

    //MYTWEETSCONTAINER
    var myTweets = new defineTweets();
    var friendsTweets = new defineTweets();
    var allTweets = new defineTweets();

    var organizeTweets = function (allTweets) {
        console.log("OrganizeTweets");
        for (var chirp in allTweets) {
            var date = new Date(allTweets[chirp].timestamp);
            if (date.toDateString().charAt(0) === "I") {
                allTweets.splice(chirp, 1);
            } else {
                var newTime = date.getTime();
                allTweets[chirp].timestamp = newTime;
            }
        };

        function dates_time(a, b) {
            return a.timestamp - b.timestamp;
        };
        allTweets.sort(dates_time);
        displayTweets(allTweets);

    };

    var displayTweets = function (allTweets) {

        var theDisplay = "<div id='chatBox' style='overflow: no-display; position: relative; width: 100%; height: 400px; margin-left: auto; margin-right: auto; margin-top: -60px;'>"
        theDisplay += "<div id='innerTweets' style='opacity: 10; border-top-left-radius: 15px; border-top-right-radius: 15px; border: 6px solid #949599; background-color: white; max-height: 330px; width: 450px; overflow: auto; position: absolute; bottom: 0; margin-top: 25px; margin-left: 6px; margin-right: 0px; padding: 0px;'>"
        for (var chirp in allTweets) {
            var displayDate = new Date(allTweets[chirp].timestamp);
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
            theDisplay += "<p style='display: inline; font-family: Cooper;'>" + allTweets[chirp].username + ":</p> <p style='display: inline;'>" + allTweets[chirp].message + "</p> <p style='display: inline; font-family: Cooper;'> " + dateView + "</p>" + "<br>";
        };
        theDisplay += "</div> </div>";
        document.getElementById("tweetsBox").innerHTML = theDisplay;
        document.getElementById("tweetsBox").innerHTML += "<input style='margin-left: 6px; margin-top: 10px; height: 35px;' type='text' id='sendMessage' size='45' placeholder='Enter Text Here'/>" + "  " + "<button class='btn btn-primary btn-large' onclick='Masterfunction.postChirp()' style='display:inline'> SEND/POST </button>";

        var testZoom = document.getElementById('innerTweets');
        $("#innerTweets").animate({ scrollTop: $("#innerTweets")[0].scrollHeight });

        //All you need to do is add the latest tweet to the existing array of tweets somehow
        setInterval(function () { getFriendsTweets(allTweets); }, 5000); //Had to use an anonymous function. Previously I used a settimeout that would call a function. That function would then use recursion to set a timeout of itself. However, with combining recursion with a timeout creates a time leak and it speeds up.

    };

    //GET METHOD #1
    var viewFriends = function (callback) {
        getFriends.callFirebase.open(getFriends.verb, getFriends.myUrl + getFriends.theUrlBase + getFriends.subUrl + getFriends.theBlueprint);
        getFriends.callFirebase.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                callback(JSON.parse(this.response));
            } else {
                alert("server responded but something is wrong");
            }
        };
        getFriends.callFirebase.onerror = function () {
            alert(this.response + ":" + "" + "SERVER 'GET' ERROR");
        };
        getFriends.callFirebase.send();
    };

    //GET METHOD #2
    var viewAllUsers = function (callback) {
        getProfile.callFirebase.open(getProfile.verb, getProfile.sharedUrl + getProfile.theUrlBase + getProfile.theBlueprint);
        getProfile.callFirebase.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                callback(JSON.parse(this.response));
            } else {
                alert("server responded but something is wrong");
            }
        };
        getProfile.callFirebase.onerror = function () {
            alert(this.response + ":" + "" + "SERVER 'GET' ERROR");
        };
        getProfile.callFirebase.send();
    };

    //GET METHOD #3
    var viewFriendsProfiles = function (callback) {
        var counter = 0;

        var friends = allFriends.browseFriends();

        var beginLoop = function () {
            if (counter < (friends.length)) {
                getProfile.callFirebase.open(getProfile.verb, friends[counter].url + "/" + getProfile.subUrl + getProfile.theBlueprint);
                getProfile.callFirebase.onload = function () {
                    if (this.status >= 200 && this.status < 400) {
                        callback(JSON.parse(this.response));
                    } else {
                        alert("server responded but something is wrong");
                    }
                };
                getProfile.callFirebase.onerror = function () {
                    alert(this.response + ":" + "" + "SERVER 'GET' ERROR");
                };
                counter++;
                getProfile.callFirebase.send();
            } else {
                callback();
                clearInterval(end);
            }
        };// beginLoop(); //Recursively calls the loop once
        var end = setInterval(beginLoop, 700); //Calls the loop continuous times. I couldn't solely depend on recursion because it's too fast, therefore, I relied on polling
    };


    //GET METHOD #4
    var viewMyProfile = function (callback) {
        getProfile.callFirebase.open(getProfile.verb, getProfile.myUrl + getProfile.theUrlBase + getProfile.subUrl + getProfile.theBlueprint);
        getProfile.callFirebase.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                callback(JSON.parse(this.response));
            } else {
                alert("server responded but something is wrong");
            }
        };
        getProfile.callFirebase.onerror = function () {
            alert(this.response + ":" + "" + "SERVER 'GET' ERROR");
        };
        getProfile.callFirebase.send();
    };

    //GET METHOD #5
    var viewMyTweets = function (callback) {
        getTweets.callFirebase.open(getTweets.verb, getTweets.myUrl + getTweets.theUrlBase + getTweets.subUrl + getTweets.theBlueprint);
        getTweets.callFirebase.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                callback(JSON.parse(this.response));
            } else {
                alert("server responded but something is wrong");
            }
        };
        getTweets.callFirebase.onerror = function () {
            alert(this.response + ":" + "" + "SERVER 'GET' ERROR");
        };
        getTweets.callFirebase.send();
    };

    //GET METHOD #6
    var viewFriendsTweets = function (callback, totalFriends) {
        var counter = 0;

        var slowDown = function () {
            if (counter < (totalFriends.length)) {
                getTweets.callFirebase.open(getTweets.verb, totalFriends[counter].url + getTweets.subUrl + getTweets.theBlueprint);
                counter++;
                getTweets.callFirebase.onload = function () {
                    if (this.status >= 200 && this.status < 400) {
                        callback(JSON.parse(this.response));  
                    } else {
                        alert("server responded but something is wrong");
                    }
                };
                getTweets.callFirebase.onerror = function () {
                    alert(this.response + ":" + "" + "SERVER 'GET' ERROR");
                };
                getTweets.callFirebase.send();
            } else {
                counter = 0;
                callback();
                clearInterval(end);
            }
        }; var end = setInterval(slowDown, 800);

    };


    //THE "GET" CALLBACK CHAIN
    viewFriends(function (payload) {
        //Locally Store Friends
        var friendsContainer = allFriends.browseFriends();
        for (var friends in payload) {
            payload[friends].Guid = friends;
            friendsContainer.push(payload[friends]);
        };

        getAllUsers(friendsContainer);
    });

    var getAllUsers = function (friendsContainer) {
        var allUsersContainer = allUsers.browseUsers();

        var display = "<div width='20%' border='1' class='container: fluid'>" + "<ul>";

        viewAllUsers(function (payload) {
            //Display Allusers
            for (var basicInfo in payload) {
                allUsersContainer.push(payload[basicInfo]);
            };

            for (var i = 0; i < allUsersContainer.length; i++) {
                if (allUsersContainer[i].name !== currentUser) {
                    display += "<li>" + allUsersContainer[i].name + " " + "<button class='btn btn-primary btn-large' onclick=\"Masterfunction.follow('" + allUsersContainer[i].name + "');\" id=abc" + i + "> Follow" + "</button>" + "</li>";
                }
            }; display += "</ul>" + "</div>";
            document.getElementById("allUsers").innerHTML = display;
            getFriendsProfiles(friendsContainer);

        });

    };

    var getFriendsProfiles = function (friendsContainer) {
        var totalFriends = allFriends.browseFriends().length;

        var profilesContainer = friendsProfiles.browseProfiles();

        if (totalFriends === 0) {
            return getMyProfile(profilesContainer);
        } else {
            viewFriendsProfiles(function (payload) {
                //Save FriendsProfiles && Display FriendsProfiles

                if (payload) {
                    for (var profiles in payload) {
                        profilesContainer.push(payload[profiles]);
                    };
                } else {
                    var profileDisplay = "<div width='20%' border='1' class='container: fluid'>";
                    var friendsDisplay = "<div width='20%' border='1' class='container: fluid'>";
                    for (var i = 0; i < friendsContainer.length; i++) {
                        friendsDisplay += "<p>" + friendsContainer[i].name + " " + "<button class='btn btn-primary btn-large' onclick=\"Masterfunction.unFollow('" + friendsContainer[i].name + "')\" id=" + "mno" + i + "> unfollow" + "</button>" + "</p>";
                        for (var j = 0; j < profilesContainer.length; j++) {
                            if (profilesContainer[j].name === friendsContainer[i].name) {
                                profileDisplay += "<p>" + profilesContainer[j].name + " " + profilesContainer[j].url + " " + profilesContainer[j].bio + "<button class='btn btn-primary btn-large' onclick=\"Masterfunction.unFollow('" + profilesContainer[j].name + "')\" id=" + "pqr" + j + "> unfollow" + "</button>" + "</p>";
                            }
                        };
                    };
                    profileDisplay += "</div>";
                    friendsDisplay += "</div>";
                    document.getElementById("allFriends").innerHTML = friendsDisplay;
                    document.getElementById("allProfiles").innerHTML = profileDisplay;
                    getMyProfile(profilesContainer);
                }

            });
        }
    };

    var getMyProfile = function (profilesContainer) {

        viewMyProfile(function (payload) {
            //Display MyProfile 
            profilesContainer.push(payload);
            var myProfileIndex = profilesContainer.length;
            var myProfile = profilesContainer[myProfileIndex - 1];
            var profileView = {};
            for (var category in myProfile) {
                if (category === "picture") {
                    profileView.picture = "<img style='height: 220px; width: 220px;' '" + myProfile[category] + "";
                }
                else if (category === "username") {
                    profileView.userName = "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + "<p id='userNameBox' style='display:inline' >" + myProfile[category] + "</p>";
                    profileView.button = "<p>" + "<button class='btn btn-primary btn-large' onclick='Masterfunction.editMode()'" + "id=" + "myProfileID" + myProfileIndex + ">" + "Edit" + "</button>" + "</p>";
                } else if (category === "name") {
                    currentUser = myProfile[category];
                    profileView.name = "<p>" + "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + myProfile[category] + "</p>";
                } else if (category === "url") {
                    profileView.url = "<p>" + "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + myProfile[category] + "</p>";
                } else if (category === "bio") {
                    profileView.bio = "<p>" + "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + myProfile[category] + "</p>";
                } else if (category === "email") {
                    profileView.email = "<p>" + "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + myProfile[category] + "</p>";
                } else {
                    continue;
                }
            };
            var w = "<div width='20%' border='1' class='container: fluid'>";
            w += profileView.name + profileView.userName + profileView.picture + profileView.bio + profileView.email + profileView.url + profileView.button;
            w += "</div>";
            document.getElementById("myProfile").innerHTML = w;

            getMyTweets();
        });
    };

    var getMyTweets = function () {
        var myTweetsContainer = myTweets.browseMyTweets();
        var allTweetsContainer = allTweets.browseAllTweets();
        var friendsContainer = allFriends.browseFriends();

        viewMyTweets(function (payload) {

            for (var chirp in payload) {
                myTweetsContainer.push(payload[chirp]);
            };
            for (var chirp in myTweetsContainer) {
                allTweetsContainer.push(myTweetsContainer[chirp]);
            };

            if (friendsContainer.length === 0) {
                return organizeTweets(allTweetsContainer);
            } else {
                getFriendsTweets(allTweetsContainer);
            }

        });

    };

    var getFriendsTweets = function (allTweetsContainer) {
        var friendsContainer = allFriends.browseFriends();
        var totalFriends = friendsContainer.length;

        if (totalFriends === 0) {
            return console.log("No friends");
        }

        viewFriendsTweets(function (payload) {

            if (longPollingCounter > totalFriends) {

                var lastMessage = allTweetsContainer.length - 1;
                var timeOfLastMessage = allTweetsContainer[lastMessage].timestamp;
                var currentDate = new Date();
                console.log("Checking for new message @ " + currentDate.getTime());

                for (var newChirp in payload) {
                    var chirpDate = new Date(payload[newChirp].timestamp);

                    if (chirpDate.toDateString().charAt(0) === "I") {
                        payload.splice(newChirp, 1);
                    } else {
                        payload[newChirp].timestamp = chirpDate.getTime();
                        if ((timeOfLastMessage < payload[newChirp].timestamp)) { /*newChirp's is more recent than any old chirp, display it*/
                            var friendsTweetsContainer = friendsTweets.browseFriendsTweets();
                            friendsTweetsContainer.push(payload[newChirp]);
                            allTweetsContainer.push(friendsTweetsContainer[length - 1]);

                            var displayDate = new Date(payload[newChirp].timestamp);
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
                            document.getElementById("innerTweets").innerHTML += "<p style='display: inline; font-family: Cooper;'>" + payload[newChirp].username + ":</p> <p style='display: inline;'>" + payload[newChirp].message + "</p> <p style='display: inline; font-family: Cooper;'> " + dateView + "</p>" + "<br>";
                            $("#innerTweets").animate({ scrollTop: $("#innerTweets")[0].scrollHeight });
                        }
                    }
                };

            } else if (payload) {

                var friendsTweetsContainer = friendsTweets.browseFriendsTweets();
                for (var chirp in payload) {
                    friendsTweetsContainer.push(payload[chirp]);
                    allTweetsContainer.push(payload[chirp]);
                };

                longPollingCounter++;
            } else { //what to do when there is no payload
                longPollingCounter++;
                organizeTweets(allTweetsContainer);
            }

        }, friendsContainer);
    };


    //POST METHOD #1
    Masterfunction.follow = function (potentialFriend) {

        //Display remaining friends locally
        var myFriendsContainer = allFriends.browseFriends();
        var myFriendsProfiles = friendsProfiles.browseProfiles();
        var allUsersContainer = allUsers.browseUsers();

        if (potentialFriend === currentUser) {
            return alert("You cannot follow yourself");
        }

        var h = "<div width='20%' border='1' class='container: fluid'>" + "<ul>";
        for (var i = 0; i < allUsersContainer.length; i++) {
            if (allUsersContainer[i].name === potentialFriend) {
                h += "<li>" + allUsersContainer[i].name + ": " + "<progress value='95' max='100'></progress>" + "</li>";
            } else if (allUsersContainer[i].name !== currentUser) {
                h += "<li>" + allUsersContainer[i].name + " " + "<button class='btn btn-primary btn-large' onclick=\"Masterfunction.follow('" + allUsersContainer[i].name + "');\" id=abc" + i + " disabled> Follow" + "</button>" + "</li>";
            } else {
                continue;
            }
        }; h += "</ul>" + "</div>";
        document.getElementById("allUsers").innerHTML = h;

        var commit = function (MyNewFriend) {
            addFriend.callFirebase.open(addFriend.verb, addFriend.myUrl + addFriend.theUrlBase + addFriend.subUrl + addFriend.theBlueprint);
            addFriend.callFirebase.onload = function () {
                if (this.status >= 200 && this.status < 400) {
                    var guidResponse = JSON.parse(this.response);   //when you post something, you get a json response with a firebase name/'id' //{"name":"JXDeVGdh062x6TdcWOX"} / -jxDfkvRR 

                    for (var guid in guidResponse) {
                        MyNewFriend.Guid = guidResponse[guid]; //possibly can access the guid via the "name" property stated in the above comment
                        myFriendsContainer.push(MyNewFriend); //You have added a Guid to that specific friend locally. This conforms to the properties that already exist for other friends
                        break;
                    };

                    viewFriendsProfiles(function (payload) {
                        //Save new Friend locally
                        if (payload) {
                            for (var profiles in payload) {
                                if (payload[profiles].name === MyNewFriend.name) {
                                    myFriendsProfiles.push(payload[profiles]);
                                }
                            };
                        } else {
                            return updateFriendsProfileView(false);
                        }
                    });
                } else {
                    alert("server responded but something is wrong");
                };
            };
            addFriend.callFirebase.onerror = function () {
                alert(this.response + ":" + "" + "SERVER 'POST' ERROR");
            };
            addFriend.callFirebase.send(JSON.stringify(MyNewFriend));

        };

        var verifyUser = function () {
            for (var user in allUsersContainer) {
                if (allUsersContainer[user].name === potentialFriend) {
                    return commit(allUsersContainer[user]);
                } else if (user === allUsersContainer.length - 1) {
                    var h = "<div width='20%' border='1' class='container: fluid'>" + "<ul>";
                    for (var i = 0; i < allUsersContainer.length; i++) {
                        if (allUsersContainer[i].name !== potentialFriend && allUsersContainer[i].name !== currentUser) {
                            h += "<li>" + allUsersContainer[i].name + " " + "<button class='btn btn-primary btn-large' onclick=\"Masterfunction.follow('" + allUsersContainer[i].name + "');\" id=abc" + i + "> Follow" + "</button>" + "</li>";
                        }
                    }; h += "</ul>" + "</div>";
                    document.getElementById("allUsers").innerHTML = h;
                    return alert("User does not exist!");
                } else {
                    continue;
                }
            }
        };


        if (myFriendsContainer.length === 0) {
            return verifyUser();
        } else {
            for (var i = 0; i <= myFriendsContainer.length; i++) {
                if (myFriendsContainer[i].name === potentialFriend) {
                    var h = "<div width='20%' border='1' class='container: fluid'>" + "<ul>";
                    for (var i = 0; i < allUsersContainer.length; i++) {
                        if (allUsersContainer[i].name !== currentUser) {
                            h += "<li>" + allUsersContainer[i].name + " " + "<button class='btn btn-primary btn-large' onclick=\"Masterfunction.follow('" + allUsersContainer[i].name + "');\" id=abc" + i + "> Follow" + "</button>" + "</li>";
                        }
                    }; h += "</ul>" + "</div>";
                    document.getElementById("allUsers").innerHTML = h;
                    return alert("Already following this user");
                } else if (i === myFriendsContainer.length - 1) {
                    return verifyUser();
                } else {
                    continue;
                }
            };
        }


    };

    //DELETE METHOD #1
    Masterfunction.unFollow = function (name) {
        document.getElementById("allProfiles").innerHTML = "<progress value='95' max='100'></progress>";
        document.getElementById("allFriends").innerHTML = "<progress value='95' max='100'></progress>";

        var friendsContainer = allFriends.browseFriends();
        var myFriendsProfiles = friendsProfiles.browseProfiles();
        var allUsersContainer = allUsers.browseUsers();

        var commit = function (updateFriends) {

            for (var i = 0; i < friendsContainer.length; i++) {
                if (friendsContainer[i].name === name) {
                    removeFriends.callFirebase.open(removeFriends.verb, removeFriends.myUrl + removeFriends.theUrlBase + removeFriends.subUrl + friendsContainer[i].Guid + removeFriends.theBlueprint);
                    removeFriends.callFirebase.onload = function () {
                        if (this.status >= 200 && this.status < 400) {
                            var oldFriendResponse = JSON.parse(this.response);

                            if (oldFriendResponse === null) {
                                return updateFriends(true);
                            }

                        } else {
                            alert("Server responded but something is wrong");
                        }
                    };
                    removeFriends.callFirebase.onerror = function () {
                        alert(this.response + ":" + "" + "SERVER 'DELETE' ERROR");
                    };
                    removeFriends.callFirebase.send(JSON.stringify(friendsContainer[i].Guid));
                    break;
                }
            };
        };

        commit(function (payload) {
            var friendsContainer = allFriends.browseFriends();

            for (var i = 0; i < friendsContainer.length; i++) {
                if (friendsContainer[i].name === name) {

                    if (myFriendsProfiles.length === 0) {
                        friendsContainer.splice(i, 1);
                        return updateFriendsProfileView(true);
                    }

                    for (var j = 0; j < myFriendsProfiles.length; j++) {
                        if (myFriendsProfiles[j].name === name) {
                            myFriendsProfiles.splice(j, 1); //This caused a problem because most people don't have a profile
                            friendsContainer.splice(i, 1);
                            return updateFriendsProfileView(true);
                        } else if ((myFriendsProfiles.length - 1) === j) {
                            if (myFriendsProfiles[j].name !== name) {
                                friendsContainer.splice(i, 1);
                                return updateFriendsProfileView(true);
                            }
                        } else {
                            continue;
                        }
                    };
                }
            };
        });

    };


    var updateFriendsProfileView = function (less) {
        var friendsContainer = allFriends.browseFriends();
        var myFriendsProfiles = friendsProfiles.browseProfiles();
        var allUsersContainer = allUsers.browseUsers();
        var counter = 0;

        if (less) {
            //Display remaining friends locally
            var profileDisplay = "<div width='20%' border='1' class='container: fluid'>";
            for (var profiles in myFriendsProfiles) {
                if (myFriendsProfiles[profiles].name !== currentUser) {
                    profileDisplay += "<p>" + myFriendsProfiles[profiles].name + " " + myFriendsProfiles[profiles].url + " " + myFriendsProfiles[profiles].bio + "<button class='btn btn-primary btn-large' onclick=\"Masterfunction.unFollow('" + myFriendsProfiles[profiles].name + "')\" id=" + "def" + i + "> unfollow" + "</button>" + "</p>";
                }
            };
            profileDisplay += "</div>";
            document.getElementById("allProfiles").innerHTML = profileDisplay;

            var friendsDisplay = "<div width='20%' border='1' class='container: fluid'>";
            for (var i = 0; i < friendsContainer.length; i++) {
                if (friendsContainer[i].name !== currentUser) {
                    friendsDisplay += "<p>" + friendsContainer[i].name + " " + "<button class='btn btn-primary btn-large' onclick=\"Masterfunction.unFollow('" + friendsContainer[i].name + "')\" id=" + "ghi" + i + "> unfollow" + "</button>" + "</p>";
                }
            };
            friendsDisplay += "</div>";
            document.getElementById("allFriends").innerHTML = friendsDisplay;
        } else {
            //Display new friends locally

            var userDisplay = "<div width='20%' border='1' class='container: fluid'>" + "<ul>";
            for (var i = 0; i < allUsersContainer.length; i++) {
                if (allUsersContainer[i].name !== currentUser) {
                    userDisplay += "<li>" + allUsersContainer[i].name + " " + "<button class='btn btn-primary btn-large' onclick=\"Masterfunction.follow('" + allUsersContainer[i].name + "');\" id=abc" + i + "> Follow" + "</button>" + "</li>";
                }
            }; userDisplay += "</ul>" + "</div>";
            document.getElementById("allUsers").innerHTML = userDisplay;

            var friendsDisplay = "<div width='20%' border='1' class='container: fluid'>";
            for (var i = 0; i < friendsContainer.length; i++) {
                if (friendsContainer[i].name !== currentUser) {
                    friendsDisplay += "<p>" + friendsContainer[i].name + " " + "<button class='btn btn-primary btn-large' onclick=\"Masterfunction.unFollow('" + friendsContainer[i].name + "')\" id=" + "wxy" + i + "> unfollow" + "</button>" + "</p>";
                }
            };
            friendsDisplay += "</div>";
            document.getElementById("allFriends").innerHTML = friendsDisplay;

            var profileDisplay = "<div width='20%' border='1' class='container: fluid'>";
            for (var profiles in myFriendsProfiles) {
                if (myFriendsProfiles[profiles].name !== currentUser) {
                    profileDisplay += "<p>" + myFriendsProfiles[profiles].name + " " + myFriendsProfiles[profiles].url + " " + myFriendsProfiles[profiles].bio + "<button class='btn btn-primary btn-large' onclick=\"Masterfunction.unFollow('" + myFriendsProfiles[profiles].name + "')\" id=" + "def" + i + "> unfollow" + "</button>" + "</p>";
                }
            }; profileDisplay += "</div>";
            document.getElementById("allProfiles").innerHTML = profileDisplay;
        }

    };


    Masterfunction.bindProfile = function () {
        var myFriendsProfiles = friendsProfiles.browseProfiles();

        for (var profile in myFriendsProfiles) {
            if (myFriendsProfiles[profile].name === currentUser) {
                myFriendsProfiles[profile].url = "https://chirp-now.firebaseio.com/";
                myFriendsProfiles[profile].name = document.getElementById("nameBox").innerHTML;
                myFriendsProfiles[profile].picture = document.getElementById("imageBox").value;
                myFriendsProfiles[profile].bio = document.getElementById("bioBox").value;
                myFriendsProfiles[profile].email = document.getElementById("emailBox").value;
                myFriendsProfiles[profile].username = document.getElementById("userNameBox").value;
                currentUser = document.getElementById("nameBox").innerHTML;
                document.getElementById("myProfile").innerHTML = "<progress value='22' max='100'></progress>"
                return modifyProfile(myFriendsProfiles[profile]);
            }
        };

    };

    //EDIT METHOD #1
    var modifyProfile = function (profile) {
        editProfile.callFirebase.open(editProfile.verb, editProfile.myUrl + editProfile.theUrlBase + editProfile.subUrl + editProfile.theBlueprint);
        editProfile.callFirebase.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                var myProfileObj = JSON.parse(this.response);
                console.log("Successfull Response:" + myProfileObj);
                document.getElementById("myProfile").innerHTML = "Profile Updated Succesfully!";

                //Reflects local change only after the http request is successfull

                var myFriendsProfiles = friendsProfiles.browseProfiles();
                var myProfile = {};
                var myProfileView = {};
                var myProfileIndex;

                for (var profile in myFriendsProfiles) {
                    if (myFriendsProfiles[profile].name === currentUser) {
                        myProfileIndex = profile;
                        myProfile = myFriendsProfiles[profile];
                        for (var category in myProfile) {
                            if (category === "picture") {
                                myProfileView.picture = "<img style='height: 220px; width: 220px;' '" + myProfile[category] + "";
                            }
                            else if (category === "username") {
                                myProfileView.userName = "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + "<p id='userNameBox' style='display:inline' >" + myProfile[category] + "</p>";
                            } else if (category === "name") {
                                currentUser = myProfile[category];
                                myProfileView.name = "<p>" + "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + myProfile[category] + "</p>";
                            } else if (category === "url") {
                                myProfileView.url = "<p>" + "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + myProfile[category] + "</p>";
                            } else if (category === "bio") {
                                myProfileView.bio = "<p>" + "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + myProfile[category] + "</p>";
                            }
                            else if (category === "email") {
                                myProfileView.email = "<p>" + "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + myProfile[category] + "</p>";
                            } else {
                                continue;
                            }
                        };
                    }
                };

                var myProfileDisplay = "<div width='20%' border='1' class='container: fluid'>";
                myProfileView.button = "<p>" + "<button class='btn btn-primary btn-large' onclick='Masterfunction.editMode()'" + "id=" + "myProfileID" + myProfileIndex + ">" + "Edit" + "</button>" + "</p>";
                myProfileDisplay += myProfileView.name + myProfileView.userName + myProfileView.picture + myProfileView.bio + myProfileView.email + myProfileView.url + myProfileView.button;
                myProfileDisplay += "</div>";
                document.getElementById("myProfile").innerHTML = myProfileDisplay;

            } else {
                alert("server responded but something is wrong");
            }
        };
        editProfile.callFirebase.onerror = function () {
            alert(this.response + ":" + "" + "SERVER 'EDIT' ERROR");
        };
        editProfile.callFirebase.send(JSON.stringify(profile));
    };


    Masterfunction.editMode = function () {
        var friendsProfilesContainer = friendsProfiles.browseProfiles();;
        var myProfile = {};

        for (var profile in friendsProfilesContainer) {
            if (friendsProfilesContainer[profile].name === currentUser) {
                myProfile = Object.create(friendsProfilesContainer[profile]);
                for (var category in myProfile) {
                    if (category === 'picture') {
                        myProfile.picture = myProfile[category];
                    } else if (category === 'bio') {
                        myProfile.bio = "About: " + "<br/>" + "<input id='bioBox' type='text' name='about' value='" + myProfile[category] + "'/>" + "<br/>";
                    } else if (category === 'name') {
                        myProfile.name = "Name:" + "<p id='nameBox' name='fullname'>" + myProfile[category] + "<p/>";
                    } else if (category === 'email') {
                        myProfile.email = "Email: " + "<br/>" + "<input id='emailBox' type='text' name='emailname' value='" + myProfile[category] + "'/>" + "<br/>";
                    } else if (category === 'username') {
                        myProfile.username = "'Username:'" + "<br/>" + "<input id='userNameBox' type='text' name='username' value='" + myProfile[category] + "'/>" + "<br/>";
                    } else if (category === 'url') {
                        myProfile.url = "'URL:'" + "<br/>" + "<input id='urlBox' type='text' name='url' value='" + myProfile[category] + "'/>" + "<br/>";
                    }
                    else {
                        continue;
                    }
                };

                var profileDisplay = "<div width='20%' border='1' id='insideProfile' class='container: fluid' style='float: right;'>";
                profileDisplay += myProfile.name + myProfile.username;
                profileDisplay += "ImageURL:" + "<br/>" + "<input id='imageBox' type='text' name='imageurl' value=' ' />" + "<br/>";
                profileDisplay += myProfile.bio + myProfile.email + myProfile.url;
                profileDisplay += "<p>" + "<button onclick='Masterfunction.bindProfile()'>" + "Submit Changes" + "</button>" + "" + "<button onclick='Masterfunction.cancelEdit()'>" + "Cancel" + "</button>" + "</p>" + "</div>";
                document.getElementById("myProfile").innerHTML = profileDisplay;
                document.getElementById("imageBox").value = myProfile.picture;
            }
        };

    };

    Masterfunction.cancelEdit = function () {
        var myFriendsProfiles = friendsProfiles.browseProfiles();
        var myProfile = {};
        var myProfileIndex;

        for (var profile in myFriendsProfiles) {
            if (myFriendsProfiles[profile].name === currentUser) {
                myProfileIndex = profile;
                myProfile = Object.create(myFriendsProfiles[profile]);
                for (var category in myProfile) {
                    if (category === "picture") {
                        myProfile.picture = "<img style='height: 220px; width: 220px;' '" + myProfile[category] + "";
                    }
                    else if (category === "username") {
                        myProfile.userName = "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + "<p id='userNameBox' style='display:inline' >" + myProfile[category] + "</p>";
                    } else if (category === "name") {
                        currentUser = myProfile[category];
                        myProfile.name = "<p>" + "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + myProfile[category] + "</p>";
                    } else if (category === "url") {
                        myProfile.url = "<p>" + "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + myProfile[category] + "</p>";
                    } else if (category === "bio") {
                        myProfile.bio = "<p>" + "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + myProfile[category] + "</p>";
                    }
                    else if (category === "email") {
                        myProfile.email = "<p>" + "<p style='text-transform: uppercase; display: inline; font-weight: 900;'>" + category + ": </p>" + myProfile[category] + "</p>";
                    } else {
                        continue;
                    }
                };
            }
        };

        var myProfileDisplay = "<div width='20%' border='1' class='container: fluid'>";
        myProfile.button = "<p>" + "<button class='btn btn-primary btn-large' onclick='Masterfunction.editMode()'" + "id=" + "myProfileID" + myProfileIndex + ">" + "Edit" + "</button>" + "</p>";
        myProfileDisplay += myProfile.name + myProfile.userName + myProfile.picture + myProfile.bio + myProfile.email + myProfile.url + myProfile.button;
        myProfileDisplay += "</div>";
        document.getElementById("myProfile").innerHTML = myProfileDisplay;
    };

    Masterfunction.postChirp = function () {
        var messageObject = {};
        var timeNow = new Date();
        messageObject.message = document.getElementById("sendMessage").value;
        document.getElementById("sendMessage").value = "";
        messageObject.timestamp = timeNow;

        if (document.getElementById("userNameBox").value) {
            messageObject.username = document.getElementById("userNameBox").value;
        } else {
            messageObject.username = document.getElementById("userNameBox").innerHTML;
        }

        postTweet.callFirebase.open(postTweet.verb, postTweet.myUrl + postTweet.theUrlBase + postTweet.subUrl + postTweet.theBlueprint);
        postTweet.callFirebase.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                console.log("Successfull Response: " + JSON.parse(this.response));
                displayMyNewestChirp(messageObject);

            } else {
                alert("serious error. server responded but something is wrong");
            }
        };

        postTweet.callFirebase.onerror = function () {
            alert(this.response + "SERVER 'POST' ERROR");
        };
        postTweet.callFirebase.send(JSON.stringify(messageObject));
    };

    var displayMyNewestChirp = function (messageObject) {
        var myTweetsContainer = myTweets.browseMyTweets();
        myTweetsContainer.push(messageObject);

        var displayDate = new Date(messageObject.timestamp);
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
        document.getElementById("innerTweets").innerHTML += "<p style='display: inline; font-family: Cooper;'>" + messageObject.username + ":</p> <p style='display: inline;'>" + messageObject.message + "</p> <p style='display: inline; font-family: Cooper;'> " + dateView + "</p>" + "<br>";
        $("#innerTweets").animate({ scrollTop: $("#innerTweets")[0].scrollHeight });
    };

};

Masterfunction();

