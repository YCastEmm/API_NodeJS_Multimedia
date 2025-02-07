import { matchedData } from "express-validator";
import { models } from "../models/index.js";
import { handleError } from "../utils/handleError.js";

const { tracksModel } = models


/**
 * Obtener todos los tracks
 * @param {*} req 
 * @param {*} res 
 */
const getTracks = async (req, res) =>{
    try {
        const data = await tracksModel.find({})
        res.send(data)
    } catch (error) {
        const errorMessage = "Error en getTracks."
        handleError.handleHTTPError(res, errorMessage, 503)
    }
}

/**
 * Obtener un track
 * @param {*} req 
 * @param {*} res 
 */
const getTrack = async (req, res) =>{
    try {
        req = matchedData(req)
        const { id } = req
        const data = await tracksModel.findById(id)
        res.send({data})
    } catch (error) {
        const errorMessage = "Error en getTrack."
        handleError.handleHTTPError(res, errorMessage, 503)
    }
}

/**
 * Crear un track
 * @param {*} req 
 * @param {*} res 
 */
const createTrack = async (req, res) =>{
    try {
        const body = matchedData(req)
        const data = await tracksModel.create(body) // función de la librería express-validator en Node.js. Se usa para extraer solo los datos validados de la solicitud (req)
        res.send({ data })
    } catch (error) {
        const errorMessage = "Error en createTrack."
        handleError.handleHTTPError(res, errorMessage, 503)
    }
}

/**
 * Modificar un track 
 * @param {*} req 
 * @param {*} res 
 */
const updateTrack = async (req, res) =>{
    try {
        const { id, ...body } = matchedData(req)
        const data = await tracksModel.findByIdAndUpdate(
            id, body
        ) 
        res.send({ data })
    } catch (error) {
        const errorMessage = "Error en updateTrack."
        handleError.handleHTTPError(res, errorMessage, 503)
    }
}

/**
 * Eliminar un track
 * @param {*} req 
 * @param {*} res 
 */
const deleteTrack = async (req, res) =>{
    try {
        const { id } = matchedData(req)

        const track = await tracksModel.findById(id)
        if (!track) {
            return res.status(404).json({ error: "El track que se quiere eliminar no existe." });
            
        }
        const data = await tracksModel.deleteOne({_id: id})
        res.json({message: "Track eliminado correctamente", deletedTrack: data})
    } catch (error) {
        const errorMessage = "Error en deleteTrack."
        handleError.handleHTTPError(res, errorMessage, 503)
    }
}



export const TrackController = {
                                    getTracks,
                                    getTrack,
                                    createTrack,
                                    updateTrack,
                                    deleteTrack
                                }