
const vscode = require('vscode');
function getClassFromHTML(words) {
	let arr = []
	let argsWords = words.split(" ")
	argsWords.forEach(args => {
		if (args.startsWith("class='")) {
			let className = args.split('\'')[1]
			arr.push(className)
		}
	})
	return arr;
}
function getIdFromHTML(words) {
	let arr = []
	let argsWords = words.split(" ")
	argsWords.forEach(args => {
		if (args.startsWith("id='")) {
			let idName = args.split('\'')[1]
			arr.push(idName)
		}
	})
	return arr;
}
function getDomByClassName(classes) {
	let result = ""
	classes.forEach(className => {
		let count = 0;
		let indexArr = []
		classes.forEach((className2, i) => {
			if (className == className2) {
				count++;
				if (count > 1) {
					indexArr.push(i)
				}
			}
		})
		if (count > 1) {
			result += `\nlet ${generateName(className)}s = document.querySelectorAll('.${className}') // ${indexArr.length} times`
			indexArr.forEach(index => {
				classes.splice(index, 1)
			})
		} else {
			result += `\nlet ${generateName(className)} = document.querySelector('.${className}')`
		}
	})
	return result
}
function getDomById(ids) {
	let result = ""
	ids.forEach(id => {
		let count = 0;
		ids.forEach(id2 => {
			if (id == id2) {
				count++;
			}
		})
		if (count > 1) {
			vscode.window.showInformationMessage(`Has id ${id} appear ${count} times`);
		}
		result += `\nlet ${generateName(id)} = document.geElementById('${id}')`;
	})
	return result;
}
function generateName(className) {
	let newClassName = className.replace(/_/g, "-");
	let args = newClassName.split('-');
	let result = "";
	args.forEach((arg, index) => {
		if (index == 0) result += arg;
		else {
			result += (arg.charAt(0).toUpperCase() + arg.slice(1));
		}
	})
	return result;
}
function activate(context) {
	console.log('Extension developed by: Nguyễn Vinh Tiếng');
	let disposable = vscode.commands.registerCommand('vt-generate-class---id-to-javascript.getDom', function () {
		const editor = vscode.window.activeTextEditor;
		let words = "";
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			let w = document.getText(selection);
			words = w.replace(/"/g, "'");
		} else {
			vscode.window.showInformationMessage('Please highlight the html need to convert ');
		}
		let classes = []
		let ids = []
		let result = ""
		if (words) {
			classes = getClassFromHTML(words)
			ids = getIdFromHTML(words)
		}
		if (classes.length == 0 && ids.length == 0) {
			vscode.window.showInformationMessage('Can not find any Class or Id in your HTML code');
		} else {
			result = getDomByClassName(classes);
			result += getDomById(ids);
		}
		if (result) {
			vscode.env.clipboard.writeText(result)
			vscode.window.showInformationMessage('Copied to clipboard successfully');
		}
		vscode.window.showInformationMessage('Hello from Vinh Tieng');
	});

	context.subscriptions.push(disposable);
}


function deactivate() { }

module.exports = {
	activate,
	deactivate
}
