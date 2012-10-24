function Sky(canvas) {
    this.canvas = canvas;
    this.children = [];

    var color = 'rgb(80, 40, 200)';
    var childNum = randInt(15, 30);

    // Make few more children to cover the top right since drawing angled.
    for (var i = 0; i < Math.floor(childNum * 4 / 3); i++) {
        this.add(new SkyChild(canvas.width / childNum * i,
                              canvas.width / childNum / 2, 3,
                              fuzzColor(color, 15)));
    }
}

Sky.prototype = {
    drawFrame: function() {
        var that = this;
        $(this.children).each(function(i, child) {
            if (child.dead) {
                that.remove(child);
            }
            child.drawFrame();
        });
    },

    add: function(child) {
        this.children.push(child);
    },

    remove: function(child) {
        var index = this.children.indexOf(child);
        this.children.splice(index, 1);
    }
};


function SkyChild(x, radius, speed, color) {
    this.x = x;
    this.y = 0;
    this.radius= radius;
    this.speed = speed + Math.floor(Math.random() * 5);
    this.color = color;

    // Factor in canvas rotation and translation.
    this.absY = -1 * (this.x - canvas.width / 2) * Math.cos(rad(45));
}

SkyChild.prototype = {
    drawFrame: function() {
        ctx.save();

        ctx.rotate(rad(-45));
        ctx.translate(canvas.width / -2, 0);

        ctx.fillStyle = ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX= this.radius;
        ctx.shadowOffsetY= this.radius;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, rad(360), true);
        ctx.fill();

        ctx.restore();
        this.update();
    },

    update: function() {
        if (this.absY > .7 * canvas.height) {
            this.dead = true;
        }
        this.y += this.speed;

        // Factor in angled speed.
        this.absY += this.speed * Math.sin(rad(45));
    },
};