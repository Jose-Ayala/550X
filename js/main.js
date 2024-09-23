$(document).ready(async function () {
    try {
        const team = await getTeamInfo($team);
        console.log('Team-Info:', team);
        $teamNumber.text(team.number);
        $teamName.text(team.number + ' - ' + team.team_name);
        $organization.text(team.organization);
        $location.text(team.location?.city + ', ' + team.location.region + ' ' + team.location.postcode);
        $country.text(team.location.country);
        $programName.text(team.program.code + ' - ' + team.program.name);
        $gameMessage.text('This years Vex V5 Robotics competition "High Stakes", team ' + team.number + ' consists of:');

        const events = await getTeamEvents($team, $start);
        console.log('Team Events:', events);
        $.each(events.data, function (index, item) {
            if (item.season && item.season.id && !$seasons.includes(item.season.id)) {
                $seasons.push(item.season.id);
            }
        });
        console.log('Seasons:', $seasons);

        const rankings = await getTeamRankings($team, $seasons);
        console.log('Rankings:', rankings);

        const matches = await getTeamMatches($team, $seasons);
        console.log('Matches:', matches);

    } catch (error) {
        console.error('Error:', error);
    }
});