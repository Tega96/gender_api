
/**
 * GET /api/classify?name=alex
 *  Extract name from query string
 *  Call https://api.genderize.io/?name=alex
 *  Recieve raw JSON
 *  Process it, and return it with status of 200
 *  Catch error
 */
export const classify = async (req, res) => {

    try {
        // Checks if name parameter is empty
        const name = req.query.name
        if (!name || name === '') {
            return res.status(400).json({message: 'Bad request: Please inpute a valid name'})
        }
        if (typeof(name) === '') {
            return res.status(422).json({message: 'Unprocessed Entity'})
        }
            
        const response = await fetch(`https://api.genderize.io/?name=${name}`);
        
        if (!response) {
            throw new Error('Error getting file from genderize api')
        }

        const data = await response.json()

        if (data.name === null || data.count === 0) {
            res.json({status: "error", message: "No prediction available for the provided name"})
        }

        const processedName = {
            name: data.name,
            gender: data.gender,
            probability: data.probability,
            sample_size: data.count,
            is_confident: (data.probability >= 0.7) && (data.count >= 100) ? 'true': 'false',
            processed_at: Date("now").toString
        }


        res.status(200).json({
            status: 'successful',
            data: processedName,
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({status: "error", message: "Server error"})
    }
};

