// Generated by CoffeeScript 1.4.0
var $S4D, Space4D;

$S4D = function(a, b, c, d) {
  return new Space4D(a, b, c, d);
};

Space4D = (function() {

  function Space4D(p, v1, v2, v3) {
    this.p = p;
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
  }

  Space4D.prototype.containsPoint = function(p) {
    var i, idxs, invMat3, j, mat3, r, rhs, rhsPart, row, sol, v, vs, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _n, _ref, _ref1, _ref2, _results, _results1;
    mat3 = ($M([this.v1.elements.slice(0, 3), this.v2.elements.slice(0, 3), this.v3.elements.slice(0, 3)])).transpose();
    rhs = p.subtract(this.p);
    i = 0;
    idxs = null;
    _ref = mat3.elements;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      if (allZeros(row)) {
        if (rhs.elements[i] !== 0) {
          return null;
        }
        if (i === 0) {
          idxs = [1, 2, 3];
        } else {
          idxs = (function() {
            _results1 = [];
            for (var _k = 0, _ref2 = i - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; 0 <= _ref2 ? _k++ : _k--){ _results1.push(_k); }
            return _results1;
          }).apply(this).concat((function() {
            _results = [];
            for (var _j = _ref1 = i + 1; _ref1 <= 3 ? _j <= 3 : _j >= 3; _ref1 <= 3 ? _j++ : _j--){ _results.push(_j); }
            return _results;
          }).apply(this));
        }
        vs = [this.v1, this.v2, this.v3];
        mat3 = [];
        for (_l = 0, _len1 = vs.length; _l < _len1; _l++) {
          v = vs[_l];
          r = [];
          for (_m = 0, _len2 = idxs.length; _m < _len2; _m++) {
            j = idxs[_m];
            r[r.length] = v.elements[j];
          }
          mat3[mat3.length] = r;
        }
        mat3 = $M(mat3);
        mat3 = mat3.transpose();
        break;
      }
      ++i;
    }
    invMat3 = mat3.inverse();
    if (invMat3 === null) {
      return null;
    }
    if (i < 3) {
      rhsPart = [];
      for (_n = 0, _len3 = idxs.length; _n < _len3; _n++) {
        j = idxs[_n];
        rhsPart[rhsPart.length] = rhs.elements[j];
      }
      rhsPart = $V(rhsPart);
      sol = invMat3.multiply(rhsPart);
      return sol;
    }
    sol = invMat3.multiply($V(rhs.elements.slice(0, 3)));
    if (this.v1.elements[3] * sol.elements[0] + this.v2.elements[3] * sol.elements[1] + this.v3.elements[3] * sol.elements[2] === rhs.elements[3]) {
      return sol;
    } else {
      return null;
    }
  };

  Space4D.prototype.containsLineSegment = function(l) {
    var e1sol, e2sol;
    e1sol = this.containsPoint(l.e1);
    if (e1sol === null) {
      return null;
    }
    e2sol = this.containsPoint(l.e2);
    if (e2sol === null) {
      return null;
    }
    return $LS4D(e1sol, e2sol);
  };

  Space4D.prototype.intersectWithLineSegment = function(l) {
    var invMat4, mat4, rhs, seg, sol;
    seg = this.containsLineSegment(l);
    if (seg === null) {
      mat4 = ($M([this.v1.elements, this.v2.elements, this.v3.elements, l.v.multiply(-1).elements])).transpose();
      rhs = l.p.subtract(this.p);
      invMat4 = mat4.inverse();
      if (invMat4 === null) {
        return null;
      }
      sol = invMat4.multiply(rhs);
      if (sol.elements[3] >= 0 && sol.elements[3] <= 1) {
        return $V(sol.elements.slice(0, 3));
      } else {
        return null;
      }
    } else {
      return seg;
    }
  };

  Space4D.prototype.intersectWithPolygon = function(pol) {
    var current, ends, i, ict, line, next, p1sol, p2sol, p3sol, _i, _ref;
    p1sol = this.containsPoint(pol.points[0]);
    p2sol = this.containsPoint(pol.points[1]);
    p3sol = this.containsPoint(pol.points[2]);
    ends = [];
    if (p1sol === null || p2sol === null || p3sol === null) {
      for (i = _i = 0, _ref = pol.points.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        current = pol.points[i];
        next = null;
        if (i === pol.points.length - 1) {
          next = pol.points[0];
        } else {
          next = pol.points[i + 1];
        }
        line = $LS4D(current, next);
        ict = this.intersectWithLineSegment(line);
        if (ict !== null) {
          ends[ends.length] = ict;
        }
      }
      console.debug(ends.length);
      if (ends.length === 2) {
        return [$LS4D(ends[0], ends[1])];
      } else if (ends.length === 4) {
        return [$LS4D(ends[0], ends[1]), $LS4D(ends[1], ends[2]), $LS4D(ends[2], ends[3]), $LS4D(ends[3], ends[0])];
      }
    }
    return null;
  };

  Space4D.prototype.rotateXY = function(theta) {
    var mat;
    mat = $M([[Math.cos(theta), Math.sin(theta), 0, 0], [-(Math.sin(theta)), Math.cos(theta), 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
    this.v1 = mat.multiply(this.v1);
    this.v2 = mat.multiply(this.v2);
    return this.v3 = mat.multiply(this.v3);
  };

  Space4D.prototype.rotateXW = function(theta) {
    var mat;
    mat = $M([[Math.cos(theta), 0, 0, Math.sin(theta)], [0, 1, 0, 0], [0, 0, 1, 0], [-(Math.sin(theta)), 0, 0, Math.cos(theta)]]);
    this.v1 = mat.multiply(this.v1);
    this.v2 = mat.multiply(this.v2);
    return this.v3 = mat.multiply(this.v3);
  };

  Space4D.prototype.rotateYW = function(theta) {
    var mat;
    mat = $M([[1, 0, 0, 0], [0, Math.cos(theta), 0, -(Math.sin(theta))], [0, 0, 1, 0], [0, Math.sin(theta), 0, Math.cos(theta)]]);
    this.v1 = mat.multiply(this.v1);
    this.v2 = mat.multiply(this.v2);
    return this.v3 = mat.multiply(this.v3);
  };

  Space4D.prototype.rotateZW = function(theta) {
    var mat;
    mat = $M([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, Math.cos(theta), -(Math.sin(theta))], [0, 0, Math.sin(theta), Math.cos(theta)]]);
    this.v1 = mat.multiply(this.v1);
    this.v2 = mat.multiply(this.v2);
    return this.v3 = mat.multiply(this.v3);
  };

  Space4D.prototype.rotateYZ = function(theta) {
    var mat;
    mat = $M([[1, 0, 0, 0], [0, Math.cos(theta), Math.sin(theta), 0], [0, -(Math.sin(theta)), Math.cos(theta), 0], [0, 0, 0, 1]]);
    this.v1 = mat.multiply(this.v1);
    this.v2 = mat.multiply(this.v2);
    return this.v3 = mat.multiply(this.v3);
  };

  Space4D.prototype.rotateXZ = function(theta) {
    var mat;
    mat = $M([[Math.cos(theta), 0, -(Math.sin(theta)), 0], [0, 1, 0, 0], [Math.sin(theta), 0, Math.cos(theta), 0], [0, 0, 0, 1]]);
    this.v1 = mat.multiply(this.v1);
    this.v2 = mat.multiply(this.v2);
    return this.v3 = mat.multiply(this.v3);
  };

  return Space4D;

})();
