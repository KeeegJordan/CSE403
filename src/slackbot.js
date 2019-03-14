const axios = require('axios');
require('dotenv').config();
const SLACK_USER_TOKEN = process.env.SLACK_USER_TOKEN;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const db = require('./db');
const qs = require('qs');

// zhen: don't put commented code in your codebase
/*
axios.post('https://slack.com/api/channels.create', 
        qs.stringify({
            token: SLACK_USER_TOKEN,
            // name of channel = name of project - pull request #
            name: `${pName}-${prNum}`
    }))
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
        // request failed
        if (res.data.ok === false) {
            // log error
            console.log(res.error);
            return;
        }
        console.log(res.data);
        // success
        // save channel info
        data.channelId = res.data.channel.id;
        data.channelName = res.data.channel.name;        
        // success
        // save user info
		data.contributorId = uid;*/

postRequest = async function (url, param) {
	return axios.post(url, qs.stringify(param))
	.then((res) => {
		// request failed
		if (res.data.ok === false) {
			// log error
			console.log(res.data.error);
			return;
		}
		return res.data;
	});
}		

createChannel = async function (pName, prNum) {
	return postRequest(
		'https://slack.com/api/groups.create', 
		{
			token: SLACK_USER_TOKEN,
			// name of channel = name of project - pull request#
			name: `3test`
		}
	).then((res) => {
		console.log(res);
		return res;
	});
}

async function inviteUser(channelId, userId)  {
	return postRequest('https://slack.com/api/groups.invite', {
		token: SLACK_USER_TOKEN,
		channel: channelId,
		user: 'UFPNJG962'
	}).then((res) => {
		console.log(res);
	});
}

async function sendMessage(channelId, text) {
	postRequest('https://slack.com/api/chat.postMessage', {
		token: SLACK_USER_TOKEN,
		channel: channelId,
		text: text
	}).then((res) => {
		console.log(res);
	});
}

async function sendSnippet(channelId, code, commitNum) {
	postRequest('https://slack.com/api/files.upload', {
		token: SLACK_USER_TOKEN,
		channels: channelId,
		content: code,
		filetype: 'diff',
		title: commitNum
	}).then((res) => {
		console.log(res);
	});
}

exports.createChannel = createChannel;
exports.inviteUser = inviteUser;
exports.sendMessage = sendMessage;
exports.sendSnippet = sendSnippet;

// new pull request
// Argument
// - pName: project name
// - prNum: Pull request #
// - contributorId: contributor Slack user id
// - code: diff of the code
// - commitNum: commit # of pull request
exports.newPR = async (pName, prNum, contributorId, code, commitNum) => {
	createChannel(pName, prNum).then((data) => {
		let channelId = data.group.id;
		inviteUser(data.group.id, contributorId).then((res)=> {
			console.log(data.group.id, channelId);
			let welcome_text = `Welcome to ${data.group.name}! You have a new pull request
// awaiting review from <@${contributorId}>. Here is the snippet:`;
			sendMessage(data.group.id, welcome_text).then((res)=> {
				sendSnippet(data.group.id, code, commitNum);
			});
		});
	});
}


// channelId: the channel to invite users to
// emails: a list of emails of the reviewers
exports.inviteReviewers = (channelId, ids) => {
	return;
}

// changes added to pull request
// channelId: the channel to send message to
// code: diff of the code
// commitNum: commit # of the latest change
exports.changesAddedPR = async (channelId, code, commitNum) => {
	// send message to channel
	text = `Changes were made to this pull request by <@${data.contributorId}>`;
	await sendMessage(channelId, text);
	await sendSnippet(channelId, code, commitNum);
}

exports.comment = (command, message, payload) => {
	return {
		"response_type": "in_channel",
		"text": `<@${payload.user_name}> made a comment: "${message}"`
	}	
}

exports.inlineComment = (command, message, payload) => {
	let line = command.slice("comment".length + 1);
	return {
		"response_type": "in_channel",
		"text": `<@${payload.user_name}> made a comment on ${line}: "${message}"`
	}
}

exports.requestChanges = (command, message, payload) => {
	return {
		"response_type": "in_channel",
		"text": `request changes on pull request :exploding_head:`,
		"attachments": [{
			"text": `${message}, by <@${payload.user_name}>`
		}]
	}
}

exports.approve = (command, message, payload) => {
	return {
		"response_type": "in_channel",
		"text": `pull request approved :rocket:`,
		"attachments": [{
			"text":`${message}, by <@${payload.user_name}>`
		}]
	};
}

exports.help = (command, message, payload) => {
	return {
		"text": `Here's some commands to get you started:`,
		"attachments": [{
			"text": help
		}]
	}
}

exports.unrecognized = (command, message, payload) => {
	return "Command not recognized, try saying `help`!";
}