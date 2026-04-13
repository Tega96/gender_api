
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
        if (!name || name === '') {
            return res.status(400).json({message: 'Error: Please inpute a valid name'})
        }
            
        const response = await fetch(`https://api.genderize.io/?name=${name}`);
        
        if (!response) {
            throw new Error('Error getting file from genderize api')
        }

        const data = await response.json()

        const processedName = {
            requstedName: data.name,
            gender: data.gender,
            Possibility: data.probability *100 + '%'
        }

        res.status(200).json({
            message: 'successful',
            data: processedName,
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Server error", error})
    }
};

