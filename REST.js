var mysql = require("mysql");




function REST_ROUTER(router, connection, md5)
{
    var self = this;
    self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5)
{
   
        var most_recent = 0;
      
        // index page 
        router.get('/', function(req, res) {       //PAGE RENDER
            var team_table = "";
            var team_score_table = "";
            var get_teams = "SELECT * FROM teams";
            
            //TEAM QUERY
            connection.query(get_teams, function(err,rows,fields) {
                for(var x in rows)
                {
                    team_table += "<tr class='clickable-row' data-href='/team/"+ rows[x].team_number +"'><td>"+ rows[x].team_number +"</td><td>"+ rows[x].team_name +"</td></tr>"; 
                }
                
            });
            
            //CONTRIB SCORE QUERY
            var get_contrib_score_rank = "SELECT * FROM teams ORDER BY avg_contrib_score DESC, team_number ASC";
            connection.query(get_contrib_score_rank, function(err, rows, fields) {
                for(var x in rows)
                {
                    team_score_table += "<tr title='"+ rows[x].team_name +"' class='clickable-row' data-href='/team/"+ rows[x].team_number +"'><td>"+ rows[x].team_number +"</td><td>"+ rows[x].avg_contrib_score +"</td><td>"+ rows[x].offensive_rating +"</td></tr>"; 
                }
                res.render('pages/index', {
                    teams1: team_table,
                    teams2: team_score_table
                });
            });
            
            
        });
        
        router.get('/team/:team_number', function(req,res) {
            var team_number = req.params.team_number;
            var team_name = "";
            var next_team_number = 0;
            var previous_team_number = 0;
            var avg_score = 0;
            var perc_high_made = 0;
            var trend_labels = "";
            var trend_data = "";
            updateTeams(team_number);
            
            
            var get_data = "SELECT * FROM teams WHERE team_number='"+ team_number +"'";
            var next_team = "SELECT * FROM teams WHERE team_number > '"+ team_number +"' ORDER BY team_number LIMIT 1";
            var previous_team = "SELECT * FROM teams WHERE team_number < '"+ team_number +"' ORDER BY team_number DESC LIMIT 1";
            var get_graph_data = "SELECT * FROM matches WHERE team_number='"+ team_number +"' ORDER BY match_number";
            
            connection.query(get_data, function(err, rows, fields) {
                team_name = rows[0].team_name;
                avg_score = rows[0].avg_contrib_score;
                perc_high_made = rows[0].perc_high_made;
            });
            
            connection.query(next_team, function(err, rows, fields) {
                if(team_number == 6141)
                    next_team_number = 118;
                else
                    next_team_number = rows[0].team_number;
            });
            
            connection.query(previous_team, function(err, rows, fields) {
                if(team_number == 118)
                    previous_team_number = 6141;
                else
                    previous_team_number = rows[0].team_number;
            });
            
            connection.query(get_graph_data, function(err, rows, fields){
                for(var x in rows)
                {
                    trend_labels += rows[x].match_number + ", ";
                    trend_data += rows[x].contributed_score + ", ";
                }
                console.log(trend_labels);
                
                res.render('pages/team', {
                    team_number: team_number, 
                    team_name: team_name,
                    next_team: next_team_number,
                    previous_team: previous_team_number,
                    avg_score: avg_score,
                    perc_high_made: perc_high_made,
                    trend_data: trend_data,
                    trend_labels: trend_labels
                });
            });
        });
    
        router.get('/data-entry', function(req, res) {
            var display_entry = "";
            if(most_recent == -1)
                display_entry = '<div class="alert alert-danger" role="alert"><p><b>Oh snap</b>, looks like this is a duplicate entry. Data not queried.</p></div>';
            else if(most_recent != -1 && most_recent != 0)
                display_entry = '<div class="alert alert-success" role="alert"><p>Data for <b>'+ most_recent +'</b> has been <b>successfully</b> entered.</p></div>';
                
            
            res.render('pages/data_entry', {
                message: display_entry
            });
        });
    
        router.post('/parse-data', function(req, res) {
            var team_number = Number(req.body.team_number);
            var match_number = Number(req.body.match_number);
            
            
            var a1_success = Number(req.body.a1_success);
            var a1_failed = Number(req.body.a1_failed);
            var a1_total  = Number(req.body.a1_total);
            var a1_assists= Number(req.body.a1_assists);
            var a1_stuck  = Number(req.body.a1_stuck);
            var a1_success_temp = a1_success;
            if(a1_success > 2)
                a1_success_temp = 2;
            
            var a2_success = Number(req.body.a2_success);
            var a2_failed = Number(req.body.a2_failed);
            var a2_total  = Number(req.body.a2_total);
            var a2_assists= Number(req.body.a2_assists);
            var a2_stuck  = Number(req.body.a2_stuck);
            var a2_success_temp = a2_success;
            if(a2_success > 2)
                a2_success_temp = 2;
            
            var b1_success = Number(req.body.b1_success);
            var b1_failed = Number(req.body.b1_failed);
            var b1_total  = Number(req.body.b1_total);
            var b1_assists= Number(req.body.b1_assists);
            var b1_stuck  = Number(req.body.b1_stuck);
            var b1_success_temp = b1_success;
            if(b1_success > 2)
                b1_success_temp = 2;
            
            var b2_success = Number(req.body.b2_success);
            var b2_failed = Number(req.body.b2_failed);
            var b2_total  = Number(req.body.b2_total);
            var b2_assists= Number(req.body.b2_assists);
            var b2_stuck  = Number(req.body.b2_stuck);
            var b2_success_temp = b2_success;
            if(b2_success > 2)
                b2_success_temp = 2;
            
            var c1_success = Number(req.body.c1_success);
            var c1_failed = Number(req.body.c1_failed);
            var c1_total  = Number(req.body.c1_total);
            var c1_assists= Number(req.body.c1_assists);
            var c1_stuck  = Number(req.body.c1_stuck);
            var c1_success_temp = c1_success;
            if(c1_success > 2)
                c1_success_temp = 2;
            
            var c2_success = Number(req.body.c2_success);
            var c2_failed = Number(req.body.c2_failed);
            var c2_total  = Number(req.body.c2_total);
            var c2_assists= Number(req.body.c2_assists);
            var c2_stuck  = Number(req.body.c2_stuck);
            var c2_success_temp = c2_success;
            if(c2_success > 2)
                c2_success_temp = 2;
            
            var d1_success = Number(req.body.d1_success);
            var d1_failed = Number(req.body.d1_failed);
            var d1_total  = Number(req.body.d1_total);
            var d1_assists= Number(req.body.d1_assists);
            var d1_stuck  = Number(req.body.d1_stuck);
            var d1_success_temp = d1_success;
            if(d1_success > 2)
                d1_success_temp = 2;
            
            var d2_success = Number(req.body.d2_success);
            var d2_failed = Number(req.body.d2_failed);
            var d2_total  = Number(req.body.d2_total);
            var d2_assists= Number(req.body.d2_assists);
            var d2_stuck  = Number(req.body.d2_stuck);
            var d2_success_temp = d2_success;
            if(d2_success > 2)
                d2_success_temp = 2;
            
            var lb_success = Number(req.body.lb_success);
            var lb_failed = Number(req.body.lb_failed);
            var lb_total  = Number(req.body.lb_total);
            var lb_assists= Number(req.body.lb_assists);
            var lb_stuck  = Number(req.body.lb_stuck);
            var lb_success_temp = lb_success;
            if(lb_success > 2)
                lb_success_temp = 2;
            
            var a1_attempts = a1_success + a1_failed + a1_assists + a1_stuck;
            var a2_attempts = a2_success + a2_failed + a2_assists + a2_stuck;
            var b1_attempts = b1_success + b1_failed + b1_assists + b1_stuck;
            var b2_attempts = b2_success + b2_failed + b2_assists + b2_stuck;
            var c1_attempts = c1_success + c1_failed + c1_assists + c1_stuck;
            var c2_attempts = c2_success + c2_failed + c2_assists + c2_stuck;
            var d1_attempts = d1_success + d1_failed + d1_assists + d1_stuck;
            var d2_attempts = d2_success + d2_failed + d2_assists + d2_stuck;
            var lb_attempts = lb_success + lb_failed + lb_assists + lb_stuck;
            
            var floor_intake = Number(req.body.floor_intake);
            var hp_intake = Number(req.body.hp_intake);
            var hp_intake_dropped = Number(req.body.hp_intake_dropped);
            var high_made = Number(req.body.high_made);
            var high_missed = Number(req.body.high_missed);
            var low_made = Number(req.body.low_missed);
            var low_missed = Number(req.body.low_missed);
            var forced_miss = Number(req.body.forced_miss);
            var knockouts = Number(req.body.knockouts);
            var driver_rating = Number(req.body.driver_rating);
            var bully_rating = Number(req.body.bully_rating);
            var hang = Number(req.body.hang);
            var challenge = Number(req.body.challenge);
            var fouls_noticed = Number(req.body.fouls_noticed);
            var auton_floor_intake = Number(req.body.auton_floor_intake);
            var auton_defense_crossed = Number(req.body.auton_defense_crossed);
            var bool_defense_crossed = 0;
           // if(auton_defense_crossed != null)
            //    bool_defense_crossed = 1;
            var auton_high_made = Number(req.body.auton_high_made);
            var auton_low_made = Number(req.body.auton_low_made);

            var total_defense_crossings = a1_success_temp + a2_success_temp + b1_success_temp + b2_success_temp + c1_success_temp + c2_success_temp + d1_success_temp + d2_success_temp + lb_success_temp;
            
            
            // TODO - -- - AUTO REACH
            var contributed_score = (10*bool_defense_crossed + 10*auton_high_made + 5*auton_low_made) + (5*total_defense_crossings + 2*low_made + 5*high_made + 15*hang + 5*challenge);
            
            console.log(bool_defense_crossed);
            var matches_sql = "INSERT INTO matches (team_number, match_number, a1_successful, a2_successful, b1_successful, b2_successful, c1_successful, c2_successful, d1_successful, d2_successful, lb_successful, a1_failed, a2_failed, b1_failed, b2_failed, c1_failed, c2_failed, d1_failed, d2_failed, lb_failed, a1_attempts, a2_attempts, b1_attempts, b2_attempts, c1_attempts, c2_attempts, d1_attempts, d2_attempts, lb_attempts, a1_total, a2_total, b1_total, b2_total, c1_total, c2_total, d1_total, d2_total, lb_total, a1_assists, a2_assists, b1_assists, b2_assists, c1_assists, c2_assists, d1_assists, d2_assists, lb_assists, a1_stuck, a2_stuck, b1_stuck, b2_stuck, c1_stuck, c2_stuck, d1_stuck, d2_stuck, lb_stuck, auton_floor_intake, auton_defense_crossed, auton_high, auton_low, tele_high_made, tele_high_missed, tele_forced_miss, tele_low_made, tele_low_missed, tele_hp_high_intake, tele_hp_high_intake_dropped, tele_floor_intake, tele_knock_out, tele_hang, tele_challenge, driver_rating, bully_rating, fouls_noticed, contributed_score) VALUES ('"+ team_number +"', '"+ match_number +"', '"+ a1_success +"', '"+ a2_success +"', '"+ b1_success +"', '"+ b2_success +"', '"+ c1_success +"', '"+ c2_success +"', '"+ d1_success +"', '"+ d2_success +"', '"+ lb_success +"', '"+ a1_failed +"', '"+ a2_failed +"', '"+ b1_failed +"', '"+ b2_failed +"', '"+ c1_failed +"', '"+ c2_failed +"', '"+ d1_failed +"', '"+ d2_failed +"', '"+ lb_failed +"', '"+ a1_attempts +"', '"+ a2_attempts +"', '"+ b1_attempts +"', '"+ b2_attempts +"', '"+ c1_attempts +"', '"+ c2_attempts +"', '"+ d1_attempts +"', '"+ d2_attempts +"', '"+ lb_attempts +"', '"+ a1_total +"', '"+ a2_total +"', '"+ b1_total +"', '"+ b2_total +"', '"+ c1_total +"', '"+ c2_total +"', '"+ d1_total +"', '"+ d2_total +"', '"+ lb_total +"', '"+ a1_assists +"', '"+ a2_assists +"', '"+ b1_assists +"', '"+ b2_assists +"', '"+ c1_assists +"', '"+ c2_assists +"', '"+ d1_assists +"', '"+ d2_assists +"', '"+ lb_assists +"', '"+ a1_stuck +"', '"+ a2_stuck +"', '"+ b1_stuck +"', '"+ b2_stuck +"', '"+ c1_stuck +"', '"+ c2_stuck +"', '"+ d1_stuck +"', '"+ d2_stuck +"', '"+ lb_stuck +"', '"+ auton_floor_intake +"', '"+ auton_defense_crossed +"', '"+ auton_high_made +"', '"+ auton_low_made +"', '"+ high_made +"', '"+ high_missed +"', '"+ forced_miss +"', '"+ low_made +"', '"+ low_missed +"', '"+ hp_intake +"', '"+ hp_intake_dropped +"', '"+ floor_intake +"', '"+ knockouts +"', '"+ hang +"', '"+ challenge +"', '"+ driver_rating +"', '"+ bully_rating +"', '"+ fouls_noticed +"', '"+ contributed_score +"')";
            
            connection.query(matches_sql, function(err) {
                if(err)
                {
                    most_recent = -1;
                    res.redirect('/data-entry');
                }
                else
                {
                    updateTeams(team_number);
                    most_recent = team_number;
                    res.redirect('/data-entry');
                }
            });
            

        });
    
    
        function updateTeams(team_number)
        {
            console.log("Data inserted into matches \n inserting data into teams for team: " + team_number);
            var team_sql = "UPDATE teams SET                                                                                                 avg_contrib_score=(SELECT AVG(contributed_score) FROM matches WHERE team_number='"+ team_number +"'),                                       avg_knockouts=(SELECT AVG(tele_knock_out) FROM matches WHERE team_number='"+ team_number +"'),                                              total_knockouts=(SELECT SUM(tele_knock_out) FROM matches WHERE team_number='"+ team_number +"'),                                              avg_floor_intakes=(SELECT AVG(tele_floor_intake) FROM matches WHERE team_number='"+ team_number +"'),                                       avg_driver_rating=(SELECT AVG(driver_rating) FROM matches WHERE team_number='"+ team_number +"'),                                           avg_bully_rating=(SELECT AVG(bully_rating) FROM matches WHERE team_number='"+ team_number +"'),                                              avg_fouls=(SELECT AVG(fouls_noticed) FROM matches WHERE team_number='"+ team_number +"'),                                                total_fouls=(SELECT SUM(fouls_noticed) FROM matches WHERE team_number='"+ team_number +"'),                                               perc_high_made=100*((SELECT SUM(tele_high_made) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(tele_high_made+tele_high_missed) FROM matches WHERE team_number='"+ team_number +"')),                                                    total_high_made=(SELECT SUM(tele_high_made) FROM matches WHERE team_number='"+ team_number +"'),                                              total_high_missed=(SELECT SUM(tele_high_missed) FROM matches WHERE team_number='"+ team_number +"'),                                          perc_a1_cross=100*((SELECT SUM(a1_successful) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(a1_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_a2_cross=100*((SELECT SUM(a2_successful) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(a2_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_b1_cross=100*((SELECT SUM(b1_successful) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(b1_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_b2_cross=100*((SELECT SUM(b2_successful) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(b2_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_c1_cross=100*((SELECT SUM(c1_successful) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(c1_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_c2_cross=100*((SELECT SUM(c2_successful) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(c2_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_d1_cross=100*((SELECT SUM(d1_successful) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(d1_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_d2_cross=100*((SELECT SUM(d2_successful) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(d2_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_lb_cross=100*((SELECT SUM(lb_successful) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(lb_attempts) FROM matches WHERE team_number='"+ team_number +"')),               tot_a1_successful=(SELECT SUM(a1_successful) FROM matches WHERE team_number='"+ team_number +"'),                                      tot_a2_successful=(SELECT SUM(a2_successful) FROM matches WHERE team_number='"+ team_number +"'),                                      tot_b1_successful=(SELECT SUM(b1_successful) FROM matches WHERE team_number='"+ team_number +"'),                                      tot_b2_successful=(SELECT SUM(b2_successful) FROM matches WHERE team_number='"+ team_number +"'),                                      tot_c1_successful=(SELECT SUM(c1_successful) FROM matches WHERE team_number='"+ team_number +"'),                                      tot_c2_successful=(SELECT SUM(c2_successful) FROM matches WHERE team_number='"+ team_number +"'),                                       tot_d1_successful=(SELECT SUM(d1_successful) FROM matches WHERE team_number='"+ team_number +"'),                                      tot_d2_successful=(SELECT SUM(d2_successful) FROM matches WHERE team_number='"+ team_number +"'),                                      tot_lb_successful=(SELECT SUM(lb_successful) FROM matches WHERE team_number='"+ team_number +"'),                                         tot_a1_failed=(SELECT SUM(a1_failed) FROM matches WHERE team_number='"+ team_number +"'),                                         tot_a2_failed=(SELECT SUM(a2_failed) FROM matches WHERE team_number='"+ team_number +"'),                                         tot_b1_failed=(SELECT SUM(b1_failed) FROM matches WHERE team_number='"+ team_number +"'),                                         tot_b2_failed=(SELECT SUM(b2_failed) FROM matches WHERE team_number='"+ team_number +"'),                                         tot_c1_failed=(SELECT SUM(c1_failed) FROM matches WHERE team_number='"+ team_number +"'),                                         tot_c2_failed=(SELECT SUM(c2_failed) FROM matches WHERE team_number='"+ team_number +"'),                                         tot_d1_failed=(SELECT SUM(d1_failed) FROM matches WHERE team_number='"+ team_number +"'),                                         tot_d2_failed=(SELECT SUM(d2_failed) FROM matches WHERE team_number='"+ team_number +"'),                                              tot_lb_failed=(SELECT SUM(lb_failed) FROM matches WHERE team_number='"+ team_number +"'),                                              total_hangs=(SELECT SUM(tele_hang) FROM matches WHERE team_number='"+ team_number +"'),                                              total_challenges=(SELECT SUM(tele_challenge) FROM matches WHERE team_number='"+ team_number +"'),                                           perc_a1_assisted=100*((SELECT SUM(a1_assists) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(a1_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_a2_assisted=100*((SELECT SUM(a2_assists) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(a2_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_b1_assisted=100*((SELECT SUM(b1_assists) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(b1_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_b2_assisted=100*((SELECT SUM(b2_assists) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(b2_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_c1_assisted=100*((SELECT SUM(c1_assists) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(c1_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_c2_assisted=100*((SELECT SUM(c2_assists) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(c2_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_d1_assisted=100*((SELECT SUM(d1_assists) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(d1_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_d2_assisted=100*((SELECT SUM(d2_assists) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(d2_attempts) FROM matches WHERE team_number='"+ team_number +"')), perc_lb_assisted=100*((SELECT SUM(lb_assists) FROM matches WHERE team_number='"+ team_number +"')/(SELECT SUM(lb_attempts) FROM matches WHERE team_number='"+ team_number +"'))                  WHERE team_number='"+ team_number +"'";
            connection.query(team_sql, function(err) {
                console.log(err);
            });
        }
    
    
}


module.exports = REST_ROUTER;