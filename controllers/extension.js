import ExtensionData_2 from '../models/extensionData.js';

export const saveProfile = async (req, res) => {
  try {
    const { email, category, purpose, name, title, location, currentCompany, profileLink, experience } = req.body;

    const user = await ExtensionData_2.findOne({ email });

    if (user) {
      const result = await ExtensionData_2.findOneAndUpdate(
        { email },
        {
          category,
          purpose,
          name,
          title,
          location,
          currentCompany,
          profileLink,
          experience
        },
        { new: true }
      );
      return res.status(201).json({ success: true, result, message: `Profile data already exist for the  ${name}, updated to new now.` });
    }

    const newProfile = new ExtensionData({
      email,
      category,
      purpose,
      name,
      title,
      location,
      currentCompany,
      profileLink,
      experience
    });
    await newProfile.save();
    res.status(201).json({ message: `Profile data successfully ${name}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save profile' });
  }
};
