
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
        const name = req.query.name

        // Checks if name parameter is empty
        if (!name) {
            return res.status(400).json({
                status: "error", 
                message: 'Bad request: Please inpute a valid name'
            })
        }


        // name.trim();

        if (typeof name !== 'string') {
            return res.status(422).json({
                status: "error", 
                message: 'Unprocessed Entity'
            })
        }
            
        const response = await fetch(`https://api.genderize.io/?name=${name}`);
        
        if (!response.ok) {
            throw new Error('Error getting file from genderize api')
        }

        const data = await response.json()

        const processTime = new Date().toUTCString();
        const processedName = {
            name: data.name,
            gender: data.gender,
            probability: data.probability,
            sample_size: data.count,
            is_confident: (data.probability >= 0.7 && data.count >= 100) ? true: false,
            processed_at: processTime
        }

        if (processedName.gender === null || processedName.sample_size === 0) {
            return res.json({
                status: "error", 
                message: "No prediction available for the provided name"
            })
        }

        res.status(200).json({
            status: 'success',
            data: processedName,
        })

    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            status: "error", 
            message: "Server error"
        })
    }
};

