// Implementation of the Greiner-Hormann polygon clipping algorithm
// https://github.com/tmpvar/polygon.clip.js
require.config({
    paths: {
        'polygon': '../../tools/common/lib/polygon'
    }
});

define(['exports', 'underscore', 'polygon', 'vec2', 'segseg'], function (exports, _, Polygon, Vec2, segseg) {
    'use strict';

    function Node(vec, alpha, intersection) {
        this.vec = vec.clone();
        this.alpha = alpha || 0;
        this.intersect = !!intersection;
    }

    Node.prototype = {
        vec: null,
        next: null,
        prev: null,
        nextPoly: null,
        neighbor: null,
        intersect: null,
        entry: null,
        visited : false,
        alpha : 0,

        nextNonIntersection : function() {
            var a = this;
            while(a && a.intersect) {
                a = a.next;
            }
            return a;
        },

        last : function() {
            var a = this;
            while (a.next && a.next !== this) {
                a = a.next;
            }
            return a;
        },

        createLoop : function() {
            var last = this.last();
            last.prev.next = this;
            this.prev = last.prev;
        },

        firstNodeOfInterest : function() {
            var a = this;

            if (a) {
                do {
                    a=a.next;
                } while(a!==this && (!a.intersect || a.intersect && a.visited));
            }

            return a;
        },

        insertBetween : function(first, last) {
            var a = first;
            while(a !== last && a.alpha < this.alpha) {
                a = a.next;
            }

            this.next = a;
            this.prev = a.prev;
            if (this.prev) {
                this.prev.next = this;
            }

            this.next.prev = this;
        }

    };

    Polygon.fromCCPoints = function(ccPoints) {
        ccPoints = _.map(ccPoints, function (p) {
            return Vec2(p.x, p.y)
        });
        return new Polygon(ccPoints);
    }

    Polygon.toCCPoints = function(points) {
        return _.map(points, function (p) {
            return cc.p(p.x, p.y);
        });
    }

    Polygon.prototype.createLinkedList = function() {
        var ret, where;

        this.each(function(p, current) {
            if (!ret) {
                where = ret = new Node(current);
            } else {
                where.next = new Node(current);
                where.next.prev = where;
                where = where.next;
            }
        });

        return ret;
    };

    Polygon.prototype.identifyIntersections = function(subjectList, clipList) {
        var subject, clip;
        var auxs = subjectList.last();
        auxs.next = new Node(subjectList.vec, auxs);
        auxs.next.prev = auxs;

        var auxc = clipList.last();
        auxc.next = new Node(clipList.vec, auxc);
        auxc.next.prev = auxc;

        for(subject = subjectList; subject.next; subject = subject.next) {
            if(!subject.intersect) {
                for(clip = clipList; clip.next; clip = clip.next) {
                    if(!clip.intersect) {

                        var a = subject.vec,
                                b = subject.next.nextNonIntersection().vec,
                                c = clip.vec,
                                d = clip.next.nextNonIntersection().vec;

                        var i = segseg(a, b, c, d);

                        if(i && i !== true) {
                            i = Vec2.fromArray(i);

                            var intersectionSubject = new Node(i.clone(), a.distance(i) / a.distance(b), true);
                            var intersectionClip = new Node(i.clone(), c.distance(i) / c.distance(d), true);
                            intersectionSubject.neighbor = intersectionClip;
                            intersectionClip.neighbor = intersectionSubject;
                            intersectionSubject.insertBetween(subject, subject.next.nextNonIntersection());
                            intersectionClip.insertBetween(clip, clip.next.nextNonIntersection());
                        }
                    }
                }
            }
        }
    };

    Polygon.prototype.identifyIntersectionType = function(subjectList, clipList, clipPoly, type) {
        var subject, clip;
        var se = this.containsPoint(subjectList.vec);
        if (type === 'union') {
            se = !se;
        }

        for(subject = subjectList; subject.next; subject = subject.next) {
            if(subject.intersect) {
                subject.entry = se;
                se = !se;
            }
        }

        var ce = !clipPoly.containsPoint(clipList.vec);
        for(clip = clipList; clip.next; clip = clip.next) {
            if(clip.intersect) {
                clip.entry = ce;
                ce = !ce;
            }
        }
    };

    Polygon.prototype.collectClipResults = function(subjectList, clipList) {
        subjectList.createLoop();
        clipList.createLoop();

        var crt, root = null, old = null, results = [], result;

        while ((crt = subjectList.firstNodeOfInterest()) !== subjectList) {
            result = [];
            for (; !crt.visited; crt = crt.neighbor) {

                result.push(crt.vec.clone());
                var forward = !crt.entry
                while(true) {
                    var newNode = new Node(crt.vec);
                    newNode.next = old;
                    old = newNode;
                    crt.visited = true;
                    crt = forward ? crt.next : crt.prev;

                    if(crt.intersect) {
                        crt.visited = true;
                        break;
                    } else {
                        result.push(crt.vec);
                    }
                }
            }

            var poly = Polygon(result).dedupe();
            poly.subjectList = subjectList;
            poly.clipList = clipList;
            results.push(poly);
            break;
        }

        return results;
    };

    Polygon.prototype.clip = function(clipPoly, type) {
        var subjectList = this.createLinkedList(),
                clipList = clipPoly.createLinkedList(),
                subject, clip;

        type = type || 'difference';

        // Phase 1: Identify and store intersections between the subject
        //                    and clip polygons
        this.identifyIntersections(subjectList, clipList);

        // Phase 2: walk the resulting linked list and mark each intersection
        //                    as entering or exiting
        this.identifyIntersectionType(subjectList, clipList, clipPoly, type);

        // Phase 3: collect resulting polygons
        return this.collectClipResults(subjectList, clipList);
    };

    return Polygon;
});