import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function () {
    this.route("attack-patterns", function() {
        this.modal("delete-modal", {
            withParams: ["deleteObjectId"],
            otherParams: {
                deleteObject: "deleteObject"
            },
            actions: {
                deleteConfirmed: "deleteConfirmed"
            }
        });
        this.modal("alert-modal", {
            withParams: ["alertObjectId"],
            otherParams: {
                alert: "alert"
            }
        });
    });
    this.route("attack-pattern", { path: "/attack-patterns/:id" });
    this.route("attack-pattern-new", { path: "/attack-pattern/new" });
    this.route("campaigns-dashboard", { path: "/campaigns/dashboard" });
    this.route("campaigns", function() {
        this.modal("delete-modal", {
            withParams: ["deleteObjectId"],
            otherParams: {
                deleteObject: "deleteObject"
            },
            actions: {
                deleteConfirmed: "deleteConfirmed"
            }
        });
        this.modal("alert-modal", {
            withParams: ["alertObjectId"],
            otherParams: {
                alert: "alert"
            }
        });
    });
    this.route("campaign-new", { path: "/campaigns/new" });
    this.route("intrusion-sets-dashboard", { path: "/intrusion-sets/dashboard" });
    this.route("intrusion-sets", function () {
        this.modal("delete-modal", {
            withParams: ["deleteObjectId"],
            otherParams: {
                deleteObject: "deleteObject"
            },
            actions: {
                deleteConfirmed: "deleteConfirmed"
            }
        });
        this.modal("alert-modal", {
            withParams: ["alertObjectId"],
            otherParams: {
                alert: "alert"
            }
        });
    });
    this.route("threat-actor", { path: "/threat-actors/:id" });
    this.route("threat-actor-new", { path: "/threat-actors/new" });
    this.route("tool", { path: "/tools/:id" });
    this.route("course-of-actions", function() {
        this.modal("delete-modal", {
            withParams: ["deleteObjectId"],
            otherParams: {
                deleteObject: "deleteObject"
            },
            actions: {
                deleteConfirmed: "deleteConfirmed"
            }
        });
        this.modal("alert-modal", {
            withParams: ["alertObjectId"],
            otherParams: {
                alert: "alert"
            }
        });
    });
    this.route("course-of-action", { path: "/course-of-actions/:id" });
    this.route("course-of-action-new", { path: "/course-of-actions/new" });
    this.route("link-explorer");
    this.route("indicator", { path: "/indicators/:id" });
    this.route("indicators");
    this.route("malware", { path: "/malwares/:id" });
    this.route("relationships", function() {
        this.modal("delete-modal", {
            withParams: ["deleteObjectId"],
            otherParams: {
                deleteObject: "deleteObject"
            },
            actions: {
                deleteConfirmed: "deleteConfirmed"
            }
        });
        this.modal("alert-modal", {
            withParams: ["alertObjectId"],
            otherParams: {
                alert: "alert"
            }
        });
    });
    this.route("relationship", { path: "/relationships/:id" });
    this.route("relationship-new", { path: "/relationships/new" });
    this.route("reports", { path: "/reports" }, function() {
        this.modal("delete-modal", {
            withParams: ["deleteObjectId"],
            otherParams: {
                deleteObject: "deleteObject"
            },
            actions: {
                deleteConfirmed: "deleteConfirmed"
            }
        });
        this.modal("alert-modal", {
            withParams: ["alertObjectId"],
            otherParams: {
                alert: "alert"
            }
        });
    });
    this.route("report-new", { path: "/reports/new" });
    this.route("report", { path: "/report/:id" });
    this.route("report-dashboard", { path: "/reports/:id/dashboard" });
    this.route("relationship-explorer");
    this.route("relationship-grid", { path: "/relationships/mitigates" }, function() {
        this.modal("alert-modal", {
            withParams: ["alertObjectId"],
            otherParams: {
                alert: "alert"
            }
        });
    });
    this.route("report-kill-chain-phase", { path: "/reports/:id/kill-chain-phases/:phase_name" });
    this.route("report-mitigates-rating", { path: "/reports/:id/mitigates-ratings/:rating" });
    this.route("partners", { path: "/partners" });
});

export default Router;
