var request = require("request");
var Twitter = require("twitter");
var spotify = require("spotify");
var keys = require("./keys.js");
var client = new Twitter(keys.twitterKeys);
var fs = require("fs");
var argv = process.argv;
var service = argv[2];
var additionalInformation = argv[3];


service = service.toLowerCase();
GetData(service, additionalInformation);

function GetData(query, addition)
{
	switch(query)
	{
		case "my-tweets":
		{
			client.get("https://api.twitter.com/1.1/search/tweets.json?q=from%3Aslappythehappy2&src=typd", function(error, tweets, response)
			{
				if(error == null)
				{
					console.log("");
					for(var i = 0; i < tweets.statuses.length && i < 20; i++)
					{
						console.log(tweets.statuses[i].text);
						console.log("Tweeted on: " + tweets.statuses[i].created_at);
						console.log("");
					}	
				}
			});
			break;
		}

		case "spotify-this-song":
		{
			if(addition === undefined)
				addition = "The Sign";

			var song = addition;
			spotify.get("https://api.spotify.com/v1/search?type=track&q=" + parseString(song), function(error, response)
			{
				var list = response.tracks.items;
				// console.log(list[1].artists[0].name);
				for(var i = 0; i < list.length; i++)
				{
					console.log("Entry " + (i+1) + ")");
					for(var j = 0; j < list[i].artists.length; j++)
					{
						console.log("Artist: " + list[i].artists[j].name);
					}
					console.log("Song Name: " + list[i].name);
					console.log("Preview Link: " + list[i].preview_url);
					console.log("Album: " + list[i].album.name + "\n");

				}
			});
			break;
		}

		case "movie-this":
		{
			if (addition === undefined)
				addition = "Mr. Nobody";

			var movie = parseString(addition);

			request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&r=json", function(error, response, body) 
			{

	  			// If the request is successful (i.e. if the response status code is 200)
	  			if (!error && response.statusCode === 200) 
	  			{
	  				// console.log(JSON.parse(body));
				    console.log("Title: " + JSON.parse(body).Title);
				    console.log("Movie Release Year: " + JSON.parse(body).Year);
				    console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
				    console.log("Country(ies) of Production: " + JSON.parse(body).Country);
				    console.log("Language: " + JSON.parse(body).Language);
				    console.log("Plot: " + JSON.parse(body).Plot);
				    console.log("Actors: " + JSON.parse(body).Actors);
				    console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
				}
			});
			break;
		}

		case "do-what-it-says":
		{
			fs.readFile("random.txt", "utf8", function(error, data) 
			{
				var dataArr = data.split(",");
				query = dataArr[0];
				addition = dataArr[1];
				GetData(query,addition);
			});

			break;
		}

		default:
		{
			console.log("\nUnable to understand request. Please choose a valid option\n");
			console.log("\tmy-tweets\n");
			console.log("This will show your last 20 tweets and when they were created at in your terminal/bash window.\n");
			console.log("\tspotify-this-song '<song name here>'\n");
			console.log("This will show various information about the song given\n");
			console.log("\tmovie-this '<movie name here>'\n");
			console.log("This will provide various information about the desired movie\n");
			console.log("\tdo-what-it-says\n");
			console.log("This will take whatever command is inside of random.txt and perform it\n");
			break;
		}
	}
}

function parseString(string)
{
	var returnValue = "";
	for(var i = 0; i < string.length; i++)
	{
		if(string[i] != " ")
			returnValue += string[i];

		else
			returnValue += "+";
	}

	return returnValue;
}