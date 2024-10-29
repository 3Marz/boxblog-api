import { Router } from "express";

export default class Route {
	router: Router
	constructor() {
		this.router = Router();
	}
}
