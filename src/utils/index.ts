/**
 * 防抖 如果在定时器的时间范围内再次触发，则重新计时间
 * @param {Function} fn 执行的函数
 * @param {Number} delay 时间
 */
 export const debounce = (fn:Function, delay = 800) => {
	let timer:any = null
	return function(...args: any) {
		clearTimeout(timer)
		timer = setTimeout(() => {
			fn.apply(this, args)
		}, delay)
	}
}

/**
 * 函数节流 在定时器时间内,重复触发不会执行
 * @param {Function} fn 执行的函数
 * @param {Number} gapTime 时间
 */
export const throttle = (fn: Function, gapTime: number) => {
	if (gapTime == null || gapTime === undefined) {
		gapTime = 1500
	}

	let _lastTime:any = null

	// 返回新的函数
	return function() {
		const _nowTime = +new Date()
		if (_nowTime - _lastTime > gapTime || !_lastTime) {
			fn.apply(this, arguments) // 将this和传递给原函数
			_lastTime = _nowTime
		}
	}
}
