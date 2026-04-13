
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

        if (name.trim === '') {
            return res.status(404).json({
                status: "error",
                message: "Bad request: name cannot be empty"
            })
        }

        if (typeof name !== 'string') {
            return res.status(422).json({
                status: "error", 
                message: 'Unprocessed Entity'
            })
        }
        
        const encodedName = encodeURIComponent(name);
        const url = `https://api.genderize.io/?name=${encodedName}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        let response;
        try {
            response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json'
                }
            });

            clearTimeout(timeoutId);
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                throw new Error('Request timeout: Genderize API did not respond in time')
            }
            throw new Error(`Network error: ${fetchError.message}`)
        }
        
        
        if (!response.ok) {
            throw new Error('Error getting file from genderize api')
        }

        const data = await response.json()

        const processTime = new Date().toUTCString();
        const processedName = {
            name: data.name || name,
            gender: data.gender || null,
            probability: data.probability !== undefined ? data.probability : null,
            sample_size: data.count || 0,
            is_confident: (data.probability >= 0.7 && data.count >= 100) ? true: false,
            processed_at: processTime
        }

        if (processedName.gender === null || processedName.sample_size === 0) {
            return res.status(200).json({
                status: "error", 
                message: "No prediction available for the provided name",
                data: processedName,
            })
        }

        // Success response
        return res.status(200).json({
            status: 'success',
            data: processedName,
        })

    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            status: "error", 
            message: "Server error", 
            error: error.message
        })
    }
};

