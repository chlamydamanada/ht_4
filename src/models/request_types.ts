import { Request } from "express";
export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithURL<U> = Request<U>;
export type RequestWithUrlAndBody<U, B> = Request<U, {}, B>;
export type RequestWithUrlAndQuery<U, Q> = Request<U, {}, {}, Q>;
