import { matchedData } from "express-validator";
import { models } from "../models/index.js";
import { handleHTTPError } from "../utils/handleError.js";
import { handleResponse } from "../utils/handleResponse.js";


const { tracksModel } = models

// Listar los tracks
const getTracks = async (req, res) =>{
    try {
        const data = await tracksModel.find({})
        handleResponse(res, 200, "Se listaron todos los tracks.", data)
    } catch (error) {
        const errorMessage = "Error en getTracks."
        handleHTTPError(res, errorMessage, 503)
    }
}

// Obtener un track por su id
const getTrack = async (req, res) =>{
    try {
        const validData = matchedData(req)
        const { id } = validData
        const data = await tracksModel.findById(id)
        handleResponse(res, 200, "Se obtuvo el track por ID ingresado.", data)
    } catch (error) {
        const errorMessage = "Error en getTrack."
        handleHTTPError(req, res, errorMessage, 503)
    }
}

// Crear un track
const createTrack = async (req, res) =>{
    try {
        const validData = matchedData(req)
        const data = await tracksModel.create(validData) // función de la librería express-validator en Node.js. Se usa para extraer solo los datos validados de la solicitud (req)
        handleResponse(res, 200, "Se creó correctamente el nuevo track.", data)
    } catch (error) {
        const errorMessage = "Error en createTrack."
        handleHTTPError(req, res, errorMessage, 503)
    }
}


// Modificar un track
const updateTrack = async (req, res) =>{
    try {
        const { id, ...body } = matchedData(req);
        const existingTrack = await tracksModel.findById(id);

        if (!existingTrack) {
            return res.status(404).send("No se encontró el documento");
        }
        const updatedTrack = await tracksModel.findByIdAndUpdate(id, body, { returnDocument: "after" }) 
        
        handleResponse(res, 200, "Se actualizó correctamente el documento", { before: existingTrack, after: updatedTrack })
    } catch (error) {
        const errorMessage = "Error en updateTrack."
        handleHTTPError(req, res, errorMessage, 503)
    }
}

// Eliminar un track
const deleteTrack = async (req, res) =>{
    try {
        const { id } = matchedData(req)

        const track = await tracksModel.findById(id)
        if (!track) {
            return res.status(404).json({ error: "El track que se quiere eliminar no existe." });
            
        }
        const data = await tracksModel.delete({ _id: id }); // Método traido de mongoose-delete para eliminación lógica: marca el documento como eliminado sin borrarlo físicamente
        handleResponse(res, 200, "Se eliminó correctamente el track.", data)
    } catch (error) {
        const errorMessage = "Error en deleteTrack."
        handleHTTPError(req, res, errorMessage, 503)
    }
}



export const TrackController = {
                                    getTracks,
                                    getTrack,
                                    createTrack,
                                    updateTrack,
                                    deleteTrack
                                }