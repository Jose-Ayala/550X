var $header = {"Authorization": "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiZTM4ODUwNGYxMWRmYjE4OGRhM2ZkMWIwNmQwMjYwOGZjNjhmNDdhMGYyOTFkZTQzNTNmMWM5NzIwYmFhNjEzYzA5NGRhZjJjOTk0NjRjMmUiLCJpYXQiOjE3MTg5NzMzOTMuNDk4MTI3OSwibmJmIjoxNzE4OTczMzkzLjQ5ODEzMSwiZXhwIjoyNjY1NjYxNzkzLjQ5MzQ4NCwic3ViIjoiMTI1MzMyIiwic2NvcGVzIjpbXX0.Q84Znn18NLvCTDiLqK0XCvW1K3iKVc8sxp8VwIiVKVOoJ6Gk174um--8PzxzrBIEHsrciVDy8O63i3MThWV4zaFtoQZPMT5ntr6QDquTHVgEgLYr840PkpwsKpDiB8m8ulG2d3EdWbCpgyVCrislYDyOjiktklBq8o3zNXESkfv3qo2SC-8AXgHq5vYAGJRkhZ1XIg0_pN4eoRXasl8nFm49M3cDc1eSr0iIeslgjT-GXP--roFUgXMFvRDhTmHKr6EEK8yqqKID-MX_GPRUvpgoTmSY3ovP220S8SCm1uFe5PjV19rt4CLxNK_oAym08wiCXYZEd7H6pYnovBvncVXA_xkbhkPrrvq1XUwN8kVOx0ixGrjcEziNB4VHie7X4L_HQXT_MuWo3gPruPmLmdyatj2Tlyp6CpZxz0pn8uUricOCO2Q5u6EhzETlsCaxzYRY-oG_ybue-9VOCEMFtZyd9lnw0kZ2CuRYZa0-rEjFfH8QvDjnKkEdVgvkg2ft7whwEoZWisNcEx_AU5tamCdypnF7aydL-CFTuPgI300UQWfSDIRKrXW8EUbX6rCzTB5AHwhaUwvnVbflyrP7iJ3Qk6Yza1mhynbInSUSxX7jFWPGOcpSpTEX6xBx08BJ4UEK6VCC37hABvE_UhKMBLNl0JGU3AWYiXRqjxPTdGo"}

// Main page variables
var $teamx = 86201;
var $teamu = 113437;
var $team = $teamx
var $teamNumber = $('#teamNumber');
var $teamName = $('#teamName');
var $organization = $('#organization');
var $location = $('#location');
var $country = $('#country');
var $programName = $('#programName');
var $start = formatDateRFC3339(new Date('2023-08-01T00:00:00Z'));
var $seasons = [];
var $events = [];
var $gameMessage = $('#gameMessage');

function formatDateRFC3339(date) {
	return date.toISOString();
}

// Awards page variables
let cachedAwardsData = [];

async function getTeamInfo(teamId) {
    return $.ajax({
        type: 'GET',
        dataType: "json",
        url: 'https://www.robotevents.com/api/v2/teams/' + teamId,
        headers: $header
    });
}

async function getTeamEvents(teamId, startDate) {
    return $.ajax({
        type: 'GET',
        dataType: "json",
        url: 'https://www.robotevents.com/api/v2/teams/' + teamId + '/events',
        headers: $header,
        data: { 'start': startDate }
    });
}

async function getTeamRankings(teamId, seasons) {
    return $.ajax({
        type: 'GET',
        dataType: "json",
        url: 'https://www.robotevents.com/api/v2/teams/' + teamId + '/rankings',
        headers: $header,
        data: {
            'season[]': seasons,
            'page': 1,
            'per_page': 200
        }
    });
}

async function getTeamMatches(teamId, seasons) {
    return $.ajax({
        type: 'GET',
        dataType: "json",
        url: 'https://www.robotevents.com/api/v2/teams/' + teamId + '/matches',
        headers: $header,
        data: {
            'season[]': seasons,
            'page': 1,
            'per_page': 200
        }
    });
}

async function getSkills(teamId, seasons) {
    return $.ajax({
        type: 'GET',
        dataType: "json",
        url: 'https://www.robotevents.com/api/v2/teams/' + teamId + '/skills',
        headers: $header,
        data: {
            'season[]': seasons,
            'page': 1,
            'per_page': 200
        }
    });
}

async function getTeamAwards(teamId, seasons) {
	return $.ajax({
        type: 'GET',
        dataType: "json",
        url: 'https://www.robotevents.com/api/v2/teams/' + teamId + '/awards',
        headers: $header,
        data: {
            'season[]': seasons,
            'page': 1,
            'per_page': 200
        }
    });
}