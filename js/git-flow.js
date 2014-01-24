var position = {
	/**
	 * m = master
	 * f = feature
	 * p = presandbox
	 */
	'sigle': {
		m0: [1, 1],
		m1: [1, 5],
		f0: [3, 1],
		f1: [3, 2],
		f2: [3, 3],
		f3: [3, 4],
		f4: [3, 5],
		f5: [3, 6],
		p0: [2, 4],
		p1: [2, 7]
	},
	'multi': {
		m0: [1, 1],
		m1: [1, 5],
		f0: [3, 1],
		f1: [3, 2],
		f2: [3, 3],
		f3: [3, 4],
		f4: [3, 6],
		p0: [2, 3],
		p1: [2, 5],
		p2:[2,6],
		p3:[2,7]
	}
}

var circleList = {};
var svgs = {
	'sigle': d3.select('#sigle').append('svg').attr('height', 400).attr('data-name', 'sigle'),
	'multi': d3.select('#multi').append('svg').attr('height', 400).attr('data-name', 'multi')
}

function createCircle(type, node, src) {
	if(node){
	var branch = {
		m: 'master',
		f: 'feature',
		p: 'presandbox'
	} [node.charAt(0)];
	var svg = svgs[type];
	var data = position[type][node];
	var color = {
		master: '#FFFF00',
		feature: '#00FFFF',
		presandbox: '##FF0000'
	}
	var circle = svg.append("circle");
	var text = svg.append('text');
	var x = data[1] * 50;
	var y = data[0] * 100;
	circle.attr("class", branch).attr("cx", x).attr("cy", y).attr("r", 10);
	text.attr('x', x).attr('y', y).text(node);

	circleList[node] = {
		x: x,
		y: y
	}

	if (src) {
		createLine(src, node, svg);
	}
	}

}
function updateTitle(svg, txt) {
	var title = svg.select('text.title');
	if (title[0][0] == null) {
		title = svg.append('text').attr('class', 'title');
	}
	title.attr('x', 10).attr('y', 50)
	title.text(txt);
}
function createLine(p1, p2, svg) {
	var c1 = circleList[p1];
	var c2 = circleList[p2];
	var line = svg.append('line');
	line.attr('x1', c1.x).attr('y1', c1.y).attr('x2', c1.x).attr('y2', c1.y).transition().attr('x2', c2.x).attr('y2', c2.y);
}

var steps = {
	'sigle': {
		current: 0,
		steps: [["单人开发 现有master分支,节点m0", ['m0']], ["从master上新建本地开发分支local-test,节点:f0", ['f0', 'm0']],["本地提交,新节点:f1", ['f1', 'f0']],["本地提交,新节点:f2", ['f2', 'f1']],["本地提交新节点f3,已经完成前端早期开发,需要提交远程", ['f3', 'f2']],["合并master分支最新代码,这里节点依然是m0", ['f3', 'm0']],["提交代码到远程分支,产生节点:p0", ['p0', 'f3']],["联调或QA阶段进行修改,继续在本地开发分支提交:f4", ['f4', 'f3']],["有项目测试通过,上线,master主干代码更新:m1", ['m1', 'm0']],["本地修改提交,产生f5", ['f5', 'f4']],["合并master最新代码m1", ['f5', 'm1']],["提交最新代码到远程分支:p1", ['p1', 'f5']]]
	},
	'multi': {
		current: 0,
		steps: [["多人开发 现有master分支,节点m0", ['m0']], ["从master上新建本地开发分支local-test,节点:f0", ['f0', 'm0']],["本地提交,新节点:f1", ['f1', 'f0']],['项目其他成员提交了一个远程分支p0',['p0']],["本地提交新节点f2", ['f2', 'f1']],['需要先合并远程分支',['f2','p0']],["再合并master分支最新代码", ['f2', 'm0']],["提交代码到远程分支p1", ['p1', 'f2']],["联调或QA阶段进行修改,继续在本地开发分支提交:f3", ['f3', 'f2']],["有项目测试通过,上线,master主干代码更新:m1", ['m1', 'm0']],["本地修改提交,产生f4", ['f4', 'f3']],['远程分支有新提交,产生节点p2',['p2']],['首先合并远程分支',['f4','p2']],["合并master最新代码m1", ['f4', 'm1']],["提交最新代码到远程分支:p3", ['p3', 'f4']]]
	}
}

function update(svgName) {
	var svg = svgs[svgName];
	var type = svg[0][0].getAttribute('data-name');
	var db = steps[type];
	var stepsList = db.steps;
	var length = stepsList.length;

	if(db.current>=length){
		db.current=0;
		svg.selectAll('circle').remove();
		svg.selectAll('line').remove();
		svg.selectAll('text').remove();
	}
	current=db.current;
	var step = stepsList[current];
	var title = step[0];
	var node = step[1][0];
	var node2 = step[1][1] || null;
	updateTitle(svg, 'step '+(current+1)+'/'+length+' : '+step[0]);
	createCircle(type, node, node2);
	db.current++;

}


