let gridLoS = (function () {

    let settings = (options) => {
        this.cellObstacleProp = options.cellObstacleProp;
        this.cellVisibleProp = options.cellVisibleProp;
        this.cellWidth = options.cellWidth;
        this.cellHeight = options.cellHeight;
    };
    settings({
        cellObstacleProp: "block",
        cellVisibleProp: "visible",
        cellWidth: 32,
        cellHeight: 32
    });


    function getCellRect(cell, pad = 0) {
        return {
            left: cell.x * this.cellWidth + pad,
            top: cell.y * this.cellHeight + pad,
            right: cell.x * this.cellWidth + this.cellWidth - pad,
            bottom: cell.y * this.cellHeight + this.cellHeight - pad
        };
    }

    function getCellCorners(cell, pad = 0) {
        let rect = getCellRect(cell);
        return {
            leftTop: {
                x: rect.left + pad,
                y: rect.top + pad
            },
            leftBottom: {
                x: rect.left + pad,
                y: rect.bottom - pad
            },
            rightTop: {
                x: rect.right - pad,
                y: rect.top + pad
            },
            rightBottom: {
                x: rect.right - pad,
                y: rect.bottom - pad
            }
        };
    }

    function getFacingCorners(cell, userCell) {
        let corners = getCellCorners(cell);
        if (cell.x == userCell.x && cell.y < userCell.y) return [corners.leftBottom, corners.rightBottom];
        if (cell.x == userCell.x && cell.y > userCell.y) return [corners.leftTop, corners.rightTop];
        if (cell.y == userCell.y && cell.x < userCell.x) return [corners.rightTop, corners.rightBottom];
        if (cell.y == userCell.y && cell.x > userCell.x) return [corners.leftBottom, corners.leftTop];
        if (cell.x < userCell.x && cell.y < userCell.y) return [corners.rightTop, corners.leftBottom];
        if (cell.x > userCell.x && cell.y < userCell.y) return [corners.leftTop, corners.rightBottom];
        if (cell.x < userCell.x && cell.y > userCell.y) return [corners.leftTop, corners.rightBottom];
        if (cell.x > userCell.x && cell.y > userCell.y) return [corners.leftBottom, corners.rightTop];
        return [];
    }

    function extendLine(start, end, dist) {
        let a = { x: start[0] || start.x, y: start[1] || start.y };
        let b = { x: end[0] || end.x, y: end[1] || end.y };
        let c = {};
        let lengthAB = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
        c.x = b.x + (b.x - a.x) / lengthAB * dist;
        c.y = b.y + (b.y - a.y) / lengthAB * dist;
        return [c.x, c.y];
    }

    function linesIntersects(line1Start, line1End, line2Start, line2End) {
        let a = line1Start[0] || line1Start.x;
        let b = line1Start[1] || line1Start.y;
        let c = line1End[0] || line1End.x;
        let d = line1End[1] || line1End.y;
        let p = line2Start[0] || line2Start.x;
        let q = line2Start[1] || line2End.y;
        let r = line2End[0] || line2End.x;
        let s = line2End[1] || line2Start.y;
        var det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
            return false;
        } else {
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    }

    function polylinesIntersects(polylineA, polylineB) {
        let i = polylineA.length;
        while (i--) {
            let lineA = polylineA[i];
            let j = polylineB.length;
            while (j--) {
                let lineB = polylineB[j];
                if (linesIntersects(lineA[0], lineA[1], lineB[0], lineB[1])) {
                    return true;
                }
            }
        }
        return false;
    }

    function polylineToPolygon(polyline) {
        let vertexes = [];
        let added = {};
        let i = polyline.length;
        while (i--) {
            let line = polyline[i];
            let j = 2;
            while (j--) {
                if (!(line[j] instanceof Array)) {
                    line[j] = [line[j].x, line[j].y];
                }
                if (!added[line[j]]) {
                    vertexes.push(line[j]);
                    added[line[j]] = true;
                }
            }
        }
        return vertexes;
    }

    function isPointInPolygone(point, vs) {
        var x = point[0], y = point[1];

        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];

            var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }

    function isPolygonInPolygon(big, small) {
        let i = small.length;
        while (i--) {
            let vertex = small[i];
            let test = isPointInPolygone(vertex, big);
            if (!test) return false;
        }
        return true;
    }


    let mapToCells = (map) => {
        let arr = [];
        const mapW = map[0].length;
        const mapH = map.length;
        for (let i = 0; i < mapW; i++) {
            for (let j = 0; j < mapH; j++) {
                let cell = {
                    x: i,
                    y: j,
                };
                cell[this.cellObstacleProp] = map[j][i] === 1;
                arr.push(cell);
            }
        }
        return arr;
    };

    let make = (cells, userCell, range) => {
        let polylines = [];
        let obstacles = cells.filter(c => !!c[this.cellObstacleProp]);
        let ux = userCell.x * this.cellWidth + this.cellWidth / 2;
        let uy = userCell.y * this.cellHeight + this.cellHeight / 2;
        let d = this.cellWidth * range;


        let i = obstacles.length;
        while (i--) {
            let obstacle = obstacles[i];
            if (obstacle.x == userCell.x && obstacle.y == userCell.y) continue;
            let corners = getFacingCorners(obstacle, userCell);
            let c1 = corners[0], c2 = corners[1];
            let poly = [
                [[c1.x, c1.y], extendLine([ux, uy], [c1.x, c1.y], d)],
                [[c2.x, c2.y], extendLine([ux, uy], [c2.x, c2.y], d)],
                [extendLine([ux, uy], [c1.x, c1.y], d),
                extendLine([ux, uy], [c2.x, c2.y], d)],

                [[ux, uy], [c2.x, c2.y]],
                [[ux, uy], [c1.x, c1.y]]
            ];
            poly.obstacle = obstacle;
            polylines.push(poly);
        }

        let intersectingCells = [];
        let cellsInShadow = [];

        i = cells.length;
        while (i--) {
            let cell = cells[i];
            cell[this.cellVisibleProp] = true;
            let c = getCellCorners(cell, 1);
            let poly = [
                [c.leftTop, c.rightTop],
                [c.leftTop, c.leftBottom],
                [c.rightTop, c.rightBottom],
                [c.leftBottom, c.rightBottom]
            ];
            let j = polylines.length;
            while (j--) {
                let hardPoly = poly.concat([[c.leftTop, c.rightBottom]]).concat([[c.leftBottom, c.rightTop]]);
                if (polylinesIntersects(hardPoly, polylines[j])) {
                    intersectingCells.push(cell);
                }
                let r = getCellRect(cell, 1);
                let obstacle = polylines[j].obstacle;
                if(obstacle.x == cell.x && obstacle.y == cell.y) continue;
                let corners = getFacingCorners(obstacle, userCell);
                let c1 = corners[0], c2 = corners[1];
                let polygonA = [
                    [ux, uy],
                    extendLine([ux, uy], [c1.x, c1.y], d),
                    extendLine([ux, uy], [c2.x, c2.y], d),
                ];
                let polygonB = [
                    [r.left, r.top],
                    [r.right, r.top],
                    [r.left, r.bottom],
                    [r.right, r.bottom]
                ];
                let test = isPolygonInPolygon(polygonA, polygonB);
                if (test) {
                    cellsInShadow.push(cell);
                    cell[this.cellVisibleProp] = false;
                    j = 0;
                }
            }
        }

        i = intersectingCells.length;
        while (i--) {
            let cell = intersectingCells[i];
            if (!cell[this.cellVisibleProp]) continue;
            j = obstacles.length;
            while (j--) {
                let obstacle = obstacles[j];
                if (obstacle.x == userCell.x && obstacle.y == userCell.y) continue;
                if (obstacle.x == cell.x && obstacle.y == cell.y) continue;
                let c = getCellCorners(obstacle);
                let obstaclePoly = [
                    [c.leftTop, c.rightTop],
                    [c.leftTop, c.leftBottom],
                    [c.rightTop, c.rightBottom],
                    [c.leftBottom, c.rightBottom]
                ];
                let center = [cell.x * this.cellWidth + this.cellWidth / 2, cell.y * this.cellHeight + this.cellHeight / 2];

                cell[this.cellVisibleProp] = true;
                let line = [[ux, uy], center];
                let poly = [line];
                let test = polylinesIntersects(poly, obstaclePoly);
                if (test) {
                    cell[this.cellVisibleProp] = false;
                    j = 0;
                }
            }
        }

        return {
            intersectingCells, cellsInShadow, polylines, cells
        };
    };

    return {
        settings, mapToCells, make
    };

})();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = gridLoS;
else
    window.gridLoS = gridLoS;