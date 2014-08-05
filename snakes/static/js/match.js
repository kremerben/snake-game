$(document).ready(function() {

var MATCHGAMECARDS = 6;
var score = 0;



    $('#easy').on("click", function() {
        MATCHGAMECARDS = 4;
        mode = "easy";
        matchGame();
    });
    $('#medium').on("click", function() {
        MATCHGAMECARDS = 6;
        mode = "medium";
        matchGame();
    });
    $('#difficult').on("click", function() {
        MATCHGAMECARDS = 8;
        mode = "difficult";
        matchGame();
    });


//GET TEAM
$('#getMyTeam').on('click', function(){
    var team_id = $("#teamDrop :selected").val();
    console.log(team_id);
    $.ajax({
        url: '/pokemon_team_info/' + team_id + '/',
        type: 'GET',
        success: function(data) {
            $('.pokemon').append(data);
        }
    });
});


// MATCH GAME SETUP
var matchGame = function() {
    score = 0;
    $('.pokemon').empty().addClass('narrow');
    var matchArray = [];
    for (var i = 0; i < MATCHGAMECARDS; i++) {
        var num = randPoke();
        matchArray.push(num, num);
    }
    shuffle(matchArray);
    $.each(matchArray, function(index, num) {
        singlePokemon(num, 'inactive');
    });
}

// MATCH GAMEPLAY
var liveCards = [];
$(document).on('click', '.pokeChar', function() {
    score++;
    if (liveCards.length < 2 && $(this).hasClass('inactive')) {
        liveCards.push($(this));
        $(this).removeClass('inactive');
        $(this).addClass('active');
    }
    if (liveCards.length > 1 ) {
        if (liveCards[0].attr('id') === liveCards[1].attr('id')) {
            $(liveCards[0]).addClass('found');
            $(liveCards[1]).addClass('found');
        } else {
            removeWithPause(liveCards);
        }
        liveCards = [];
    }
    if ($('.found').length === MATCHGAMECARDS * 2) {
        $('#overlay').toggle('slow');
        $('#overlay span').html('<br><h1>Winner in ' + score + ' clicks!');
        data = {'score': score, 'game': 'memory', 'mode': mode};
        data = JSON.stringify(data);
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/update_score/",
            data: data,
            success: function(response) {
                console.log(response);
            },
            error: function(response) {
                console.log(response);
            }
        });
    }
});

// FLIP BACK OVER
var removeWithPause = function(cards) {
        var upTo = 2;
        var counter = 0;
        function pauseLoop() {
            if (counter++ < upTo) {
                if (counter === 2) {
                    $(cards[0]).removeClass('active').addClass('inactive');
                    $(cards[1]).removeClass('active').addClass('inactive');
                }
                setTimeout(pauseLoop, 1000);
            }
        }
        pauseLoop();
};

//OVERLAY CLEAR
$(document).on('click', '#overlay', function() {
//    $('#special').show();
    $('#overlay').toggle('slow');
    $('#box').removeClass('specialBox');
    $('.special').remove();
});


// SINGLE POKEMON
$('#pokeSingle').on('click', function() {
    $('#playThisTeamButton').remove();
    $('#specialTeamButton').remove();
    $('.pokemon').empty();
    singlePokemon(randPoke());
    var specialTeamButton = document.createElement('button');
    specialTeamButton.id = 'specialTeamButton';
    $(specialTeamButton).text("Save to special Team");
    $('.pokemon').append(specialTeamButton);
});





// TEAM OF POKEMON WITH PAUSE
var teamPokemon = [];
$('#pokeTeam').on('click', function() {
    $('#playThisTeamButton2').remove();
    $('#playThisTeamButton').remove();
    teamPokemon = [];
    $('.pokemon').empty().removeClass('narrow');
        var teamNum = 6;
        var counter = 0;
        function pauseLoop() {
            if (counter++ < teamNum) {
                singlePokemon(randPoke(), "");
                setTimeout(pauseLoop, 500);
            }
        }
        pauseLoop();
        var playThisTeam = document.createElement('button');
        playThisTeam.id = 'playThisTeamButton';
        $(playThisTeam).text("Play the Match Game with this Team");
        $('#box').append(playThisTeam);
});




// LOOPING POKEMON
var multiPokemon = function(num) {
    for (var i = 0; i < num; i++) {
        singlePokemon(randPoke(), "");
    }
};

//MAKING A POKEMON
var singlePokemon = function(pokemonNumber, addclass) {
        $.ajax({
            url: "http://pokeapi.co/api/v1/sprite/" + pokemonNumber + '/',
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                pokemon = {};
                pokemon.name = data.pokemon.name;
                pokemon.pokedex_id = data.id - 1;
                pokemon.image = 'http://pokeapi.co' + data.image;
                var pokeDiv = document.createElement("div");
                pokeDiv.id = pokemon.pokedex_id;
                pokeDiv.innerHTML = '<h3>' + pokemon.name + ' - ' + pokemon.pokedex_id + '</3>';
                $(pokeDiv).addClass('pokeChar').addClass(addclass);
                $('.pokemon').append(pokeDiv);
                $(pokeDiv).append('<img src="' + pokemon.image + '" />');


                teamPokemon.push(pokemon);
                animatethis($('#'+pokemon.pokedex_id+' img'), 2000);

            }
        });
    };


function shuffle(array) {
    var current = array.length, temp, rand;
    while (0 !== current) {
        rand = Math.floor(Math.random() * current);
        current -= 1;
        temp = array[current];
        array[current] = array[rand];
        array[rand] = temp;
    }
    return array;
}

var randPoke = function() {
    return Math.floor((Math.random() * 719) + 2);
};


function animatethis(targetElement, speed) {
    if (speed !== 0) {
        $(targetElement).animate({ marginLeft: "+=5px"},
            {
                duration: speed,
                complete: function () {
                    targetElement.animate({ marginLeft: "-=5px" },
                        {
                            duration: speed,
                            complete: function () {
                                animatethis(targetElement, speed);
                            }
                        });
                }
            });
    };
}





















































    var special = document.createElement('button');
special.id = 'special';
$(special).text("Lebowski!!!");
$('#matchGame').after(special);
$(special).hide();


var lebowski1 = {
        'name': "Dude",
        'id': '1',
        'image': 'img/lebowski/1.jpg'
    };

var lebowski2 = {
        'name': "Maude",
        'id': '2',
        'image': 'img/lebowski/2.jpg'
    };
var lebowski3 = {
        'name': "Jesus",
        'id': '3',
        'image': 'img/lebowski/3.jpg'
    };
var lebowski4 = {
        'name': "Walter",
        'id': '4',
        'image': 'img/lebowski/4.jpg'
    };
var lebowski5 = {
        'name': "Donny",
        'id': '5',
        'image': 'img/lebowski/5.jpg'
    };
var lebowski6 = {
        'name': "The Stranger",
        'id': '6',
        'image': 'img/lebowski/6.jpg'
    };


$('#special').on('click', function() {
    $('#box').addClass('specialBox');
    MATCHGAMECARDS = 6;
    $('#playThisTeamButton').remove();
    score = 0;
    $('.pokemon').empty().addClass('narrow');
//    $('.pokemonTeam').empty();
    lebowskiArray = [lebowski1, lebowski2, lebowski3, lebowski4, lebowski5, lebowski6, lebowski1, lebowski2, lebowski3, lebowski4, lebowski5, lebowski6];
    shuffle(lebowskiArray);
    $.each(lebowskiArray, function(index, val) {
        singleLebowski(val, 'inactive special');
    });
});

    //MAKING A POKEMON
var singleLebowski = function(data, addclass) {
        lebowskis = {};
        lebowskis.name = data.name;
        lebowskis.id = data.id;
        lebowskis.image = data.image;
        var pokeDiv = document.createElement("div");
        pokeDiv.id = lebowskis.id;
        pokeDiv.innerHTML = '<h3>' + lebowskis.name + '</3>';
        $(pokeDiv).addClass('pokeChar').addClass(addclass);
        $('.pokemon').append(pokeDiv);
        $(pokeDiv).append('<img src="static/' + lebowskis.image + '" />');
        animatethis($('#'+pokeDiv.id+' img'), 2000);

            };





});
