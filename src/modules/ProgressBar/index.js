const { slog, clicolor } = require('./commonModules');
const { time } = require('../../tools/utils');

/**
 * ProgressBar 命令行进度条
 * @param {string} description 命令行开头的文字信息
 * @param {number} bar_length 进度条的长度(单位：字符)，默认设为 25
 */
function ProgressBar(description, bar_length) {
	// 两个基本参数(属性)
	this.description = description || 'Progress';    // 命令行开头的文字信息
	this.length = bar_length || 25;           // 进度条的长度(单位：字符)，默认设为 25
	this.description = clicolor.blue.bold(this.description);
	// 刷新进度条图案、文字的方法

	/**
	 * @param {object} opts 
	 * completed 已完成
	 * total 全长
	 */
	this.render = function (opts) {
		let percent = (opts.completed / opts.total).toFixed(4);  // 计算进度(子任务的 完成数 除以 总数)
		let cell_num = Math.floor(percent * this.length);       // 计算需要多少个 █ 符号来拼凑图案

		// 拼接黑色条
		let cell = '';
		for (let i = 0; i < cell_num; i++) {
			cell += '█';
		}

		// 拼接灰色条
		let empty = '';
		for (let i = 0; i < this.length - cell_num; i++) {
			empty += '░';
		}

		cell = clicolor.green.bgBlack.bold(cell);
		opts.completed = clicolor.yellow.bold(byteSize(opts.completed));
		opts.total = clicolor.blue.bold(byteSize(opts.total));
		this.status = (100 * percent).toFixed(2) == 100.00 ? opts.status.end : opts.status.down;
		// 拼接最终文本
		let cmdText = this.description + ': ' + (100 * percent).toFixed(2) + '% ' + cell + empty + ' ' + opts.completed + '/' + opts.total + ' ' + time(new Date().valueOf() / 1000 - parseInt(opts.time.start)) + ' ' + this.status;

		if ((100 * percent).toFixed(2) !== '100.00' || !opts.hiden) {
			slog(cmdText);
		} else {
			slog('');
		}
	};
}

module.exports = ProgressBar